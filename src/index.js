const firebaseKeyEncode = require("firebase-key-encode");
const WebRtcPeer = require("./WebRtcPeer");

class FirebaseWebRtcAdapter {
  /**
    Config structure:
    config.authType: none;
    config.apiKey: your-api;
    config.authDomain: your-project.firebaseapp.com;
    config.databaseURL: https://your-project.firebaseio.com;
  */
  constructor(firebase, config) {
    this.rootPath = "networked-aframe";

    this.localId = null;
    this.appId = null;
    this.roomId = null;

    this.peers = {}; // id -> WebRtcPeer
    this.occupants = {}; // id -> joinTimestamp

    config = config || window.firebaseConfig;
    this.firebase = firebase || window.firebase;

    if (this.firebase === undefined) {
      throw new Error(
        "Import https://www.gstatic.com/firebasejs/x.x.x/firebase.js"
      );
    }

    this.authType = config.authType;
    this.apiKey = config.apiKey;
    this.authDomain = config.authDomain;
    this.databaseURL = config.databaseURL;
  }

  /*
   * Call before `connect`
   */

  setServerUrl(url) {
    // handled in config
  }

  setApp(appId) {
    this.appId = appId;
  }

  setRoom(roomId) {
    this.roomId = roomId;
  }

  // options: { datachannel: bool, audio: bool }
  setWebRtcOptions(options) {
    // TODO: support audio and video
    if (options.datachannel === false)
      NAF.log.warn(
        "FirebaseWebRtcAdapter.setWebRtcOptions: datachannel must be true."
      );
    if (options.audio === true)
      NAF.log.warn("FirebaseWebRtcAdapter does not support audio yet.");
    if (options.video === true)
      NAF.log.warn("FirebaseWebRtcAdapter does not support video yet.");
  }

  setServerConnectListeners(successListener, failureListener) {
    this.connectSuccess = successListener;
    this.connectFailure = failureListener;
  }

  setRoomOccupantListener(occupantListener) {
    this.occupantListener = occupantListener;
  }

  setDataChannelListeners(openListener, closedListener, messageListener) {
    this.openListener = openListener;
    this.closedListener = closedListener;
    this.messageListener = function(remoteId, dataType, data) {
      var decodedData = firebaseKeyEncode.deepDecode(data);
      messageListener(remoteId, dataType, decodedData);
    };
  }

  connect() {
    var self = this;

    this.initFirebase(function(id) {
      self.localId = id;
      var firebaseApp = self.firebaseApp;

      // Note: assuming that data transfer via firebase realtime database
      //       is reliable and in order
      // TODO: can race among peers? If so, fix

      self.getTimestamp(function(timestamp) {
        self.myRoomJoinTime = timestamp;

        var userRef = firebaseApp
          .database()
          .ref(self.getUserPath(self.localId));
        userRef.set({ timestamp: timestamp, signal: "", data: "" });
        userRef.onDisconnect().remove();

        var roomRef = firebaseApp.database().ref(self.getRoomPath());

        roomRef.on("child_added", function(data) {
          var remoteId = data.key;

          if (
            remoteId === self.localId ||
            remoteId === "timestamp" ||
            self.peers[remoteId] !== undefined
          )
            return;

          var remoteTimestamp = data.val().timestamp;

          var peer = new WebRtcPeer(
            self.localId,
            remoteId,
            // send signal function
            function(data) {
              firebaseApp
                .database()
                .ref(self.getSignalPath(self.localId))
                .set(data);
            }
          );
          peer.setDatachannelListeners(
            self.openListener,
            self.closedListener,
            self.messageListener
          );

          self.peers[remoteId] = peer;
          self.occupants[remoteId] = remoteTimestamp;

          // received signal
          firebaseApp
            .database()
            .ref(self.getSignalPath(remoteId))
            .on("value", function(data) {
              var value = data.val();
              if (value === null || value === "") return;
              peer.handleSignal(value);
            });

          // received data
          firebaseApp
            .database()
            .ref(self.getDataPath(remoteId))
            .on("value", function(data) {
              var value = data.val();
              if (value === null || value === "" || value.to !== self.localId)
                return;
              self.messageListener(remoteId, value.type, value.data);
            });

          // send offer from a peer who
          //   - later joined the room, or
          //   - has larger id if two peers joined the room at same time
          if (
            timestamp > remoteTimestamp ||
            (timestamp === remoteTimestamp && self.localId > remoteId)
          )
            peer.offer();

          self.occupantListener(self.occupants);
        });

        roomRef.on("child_removed", function(data) {
          var remoteId = data.key;

          if (
            remoteId === self.localId ||
            remoteId === "timestamp" ||
            self.peers[remoteId] === undefined
          )
            return;

          delete self.peers[remoteId];
          delete self.occupants[remoteId];

          self.occupantListener(self.occupants);
        });

        self.connectSuccess(self.localId);
      });
    });
  }

  shouldStartConnectionTo(client) {
    return (this.myRoomJoinTime || 0) <= (client ? client.roomJoinTime : 0);
  }

  startStreamConnection(clientId) {
    // Handled by WebRtcPeer
  }

  closeStreamConnection(clientId) {
    // Handled by WebRtcPeer
  }

  sendData(clientId, dataType, data) {
    this.peers[clientId].send(dataType, data);
  }

  sendDataGuaranteed(clientId, dataType, data) {
    var clonedData = JSON.parse(JSON.stringify(data));
    var encodedData = firebaseKeyEncode.deepEncode(clonedData);
    this.firebaseApp
      .database()
      .ref(this.getDataPath(this.localId))
      .set({
        to: clientId,
        type: dataType,
        data: encodedData
      });
  }

  broadcastData(dataType, data) {
    for (var clientId in this.peers) {
      if (this.peers.hasOwnProperty(clientId)) {
        this.sendData(clientId, dataType, data);
      }
    }
  }

  broadcastDataGuaranteed(dataType, data) {
    for (var clientId in this.peers) {
      if (this.peers.hasOwnProperty(clientId)) {
        this.sendDataGuaranteed(clientId, dataType, data);
      }
    }
  }

  getConnectStatus(clientId) {
    var peer = this.peers[clientId];

    if (peer === undefined) return NAF.adapters.NOT_CONNECTED;

    switch (peer.getStatus()) {
      case WebRtcPeer.IS_CONNECTED:
        return NAF.adapters.IS_CONNECTED;

      case WebRtcPeer.CONNECTING:
        return NAF.adapters.CONNECTING;

      case WebRtcPeer.NOT_CONNECTED:
      default:
        return NAF.adapters.NOT_CONNECTED;
    }
  }

  /*
   * Privates
   */

  initFirebase(callback) {
    this.firebaseApp = this.firebase.initializeApp(
      {
        apiKey: this.apiKey,
        authDomain: this.authDomain,
        databaseURL: this.databaseURL
      },
      this.appId
    );

    this.auth(this.authType, callback);
  }

  auth(type, callback) {
    switch (type) {
      case "none":
        this.authNone(callback);
        break;

      case "anonymous":
        this.authAnonymous(callback);
        break;

      // TODO: support other auth type
      default:
        NAF.log.log("FirebaseWebRtcInterface.auth: Unknown authType " + type);
        break;
    }
  }

  authNone(callback) {
    var self = this;

    // asynchronously invokes open listeners for the compatibility with other auth types.
    // TODO: generate not just random but also unique id
    requestAnimationFrame(function() {
      callback(self.randomString());
    });
  }

  authAnonymous(callback) {
    var self = this;
    var firebaseApp = this.firebaseApp;

    firebaseApp
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        NAF.log.error("FirebaseWebRtcInterface.authAnonymous: " + error);
        self.connectFailure(null, error);
      });

    firebaseApp.auth().onAuthStateChanged(function(user) {
      if (user !== null) {
        callback(user.uid);
      }
    });
  }

  /*
   * realtime database layout
   *
   * /rootPath/appId/roomId/
   *   - /userId/
   *     - timestamp: joining the room timestamp
   *     - signal: used to send signal
   *     - data: used to send guaranteed data
   *   - /timestamp/: working path to get timestamp
   *     - userId:
   */

  getRootPath() {
    return this.rootPath;
  }

  getAppPath() {
    return this.getRootPath() + "/" + this.appId;
  }

  getRoomPath() {
    return this.getAppPath() + "/" + this.roomId;
  }

  getUserPath(id) {
    return this.getRoomPath() + "/" + id;
  }

  getSignalPath(id) {
    return this.getUserPath(id) + "/signal";
  }

  getDataPath(id) {
    return this.getUserPath(id) + "/data";
  }

  getTimestampGenerationPath(id) {
    return this.getRoomPath() + "/timestamp/" + id;
  }

  randomString() {
    var stringLength = 16;
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
    var string = "";

    for (var i = 0; i < stringLength; i++) {
      var randomNumber = Math.floor(Math.random() * chars.length);
      string += chars.substring(randomNumber, randomNumber + 1);
    }

    return string;
  }

  getTimestamp(callback) {
    var firebaseApp = this.firebaseApp;
    var ref = firebaseApp
      .database()
      .ref(this.getTimestampGenerationPath(this.localId));
    ref.set(this.firebase.database.ServerValue.TIMESTAMP);
    ref.once("value", function(data) {
      var timestamp = data.val();
      ref.remove();
      callback(timestamp);
    });
    ref.onDisconnect().remove();
  }
}

NAF.adapters.register("firebase", FirebaseWebRtcAdapter);

module.exports = FirebaseWebRtcAdapter;
