/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var firebaseKeyEncode = __webpack_require__(1);
var WebRtcPeer = __webpack_require__(2);

var FirebaseWebRtcAdapter = function () {
  /**
    Config structure:
    config.authType: none;
    config.apiKey: your-api;
    config.authDomain: your-project.firebaseapp.com;
    config.databaseURL: https://your-project.firebaseio.com;
  */
  function FirebaseWebRtcAdapter(firebase, config) {
    _classCallCheck(this, FirebaseWebRtcAdapter);

    this.rootPath = "networked-aframe";

    this.localId = null;
    this.appId = null;
    this.roomId = null;

    this.peers = {}; // id -> WebRtcPeer
    this.occupants = {}; // id -> joinTimestamp

    config = config || window.firebaseConfig;
    this.firebase = firebase || window.firebase;

    if (this.firebase === undefined) {
      throw new Error("Import https://www.gstatic.com/firebasejs/x.x.x/firebase.js");
    }

    this.authType = config.authType;
    this.apiKey = config.apiKey;
    this.authDomain = config.authDomain;
    this.databaseURL = config.databaseURL;
  }

  /*
   * Call before `connect`
   */

  _createClass(FirebaseWebRtcAdapter, [{
    key: "setServerUrl",
    value: function setServerUrl(url) {
      // handled in config
    }
  }, {
    key: "setApp",
    value: function setApp(appId) {
      this.appId = appId;
    }
  }, {
    key: "setRoom",
    value: function setRoom(roomId) {
      this.roomId = roomId;
    }

    // options: { datachannel: bool, audio: bool }

  }, {
    key: "setWebRtcOptions",
    value: function setWebRtcOptions(options) {
      // TODO: support audio and video
      if (options.datachannel === false) console.warn("FirebaseWebRtcAdapter.setWebRtcOptions: datachannel must be true.");
      if (options.audio === true) console.warn("FirebaseWebRtcAdapter does not support audio yet.");
      if (options.video === true) console.warn("FirebaseWebRtcAdapter does not support video yet.");
    }
  }, {
    key: "setServerConnectListeners",
    value: function setServerConnectListeners(successListener, failureListener) {
      this.connectSuccess = successListener;
      this.connectFailure = failureListener;
    }
  }, {
    key: "setRoomOccupantListener",
    value: function setRoomOccupantListener(occupantListener) {
      this.occupantListener = occupantListener;
    }
  }, {
    key: "setDataChannelListeners",
    value: function setDataChannelListeners(openListener, closedListener, messageListener) {
      this.openListener = openListener;
      this.closedListener = closedListener;
      this.messageListener = function (remoteId, dataType, data) {
        var decodedData = firebaseKeyEncode.deepDecode(data);
        messageListener(remoteId, dataType, decodedData);
      };
    }
  }, {
    key: "connect",
    value: function connect() {
      var self = this;

      this.initFirebase(function (id) {
        self.localId = id;
        var firebaseApp = self.firebaseApp;

        // Note: assuming that data transfer via firebase realtime database
        //       is reliable and in order
        // TODO: can race among peers? If so, fix

        self.getTimestamp(function (timestamp) {
          self.myRoomJoinTime = timestamp;

          var userRef = firebaseApp.database().ref(self.getUserPath(self.localId));
          userRef.set({ timestamp: timestamp, signal: "", data: "" });
          userRef.onDisconnect().remove();

          var roomRef = firebaseApp.database().ref(self.getRoomPath());

          roomRef.on("child_added", function (data) {
            var remoteId = data.key;

            if (remoteId === self.localId || remoteId === "timestamp" || self.peers[remoteId] !== undefined) return;

            var remoteTimestamp = data.val().timestamp;

            var peer = new WebRtcPeer(self.localId, remoteId,
            // send signal function
            function (data) {
              firebaseApp.database().ref(self.getSignalPath(self.localId)).set(data);
            });
            peer.setDatachannelListeners(self.openListener, self.closedListener, self.messageListener);

            self.peers[remoteId] = peer;
            self.occupants[remoteId] = remoteTimestamp;

            // received signal
            firebaseApp.database().ref(self.getSignalPath(remoteId)).on("value", function (data) {
              var value = data.val();
              if (value === null || value === "") return;
              peer.handleSignal(value);
            });

            // received data
            firebaseApp.database().ref(self.getDataPath(remoteId)).on("value", function (data) {
              var value = data.val();
              if (value === null || value === "" || value.to !== self.localId) return;
              self.messageListener(remoteId, value.type, value.data);
            });

            // send offer from a peer who
            //   - later joined the room, or
            //   - has larger id if two peers joined the room at same time
            if (timestamp > remoteTimestamp || timestamp === remoteTimestamp && self.localId > remoteId) peer.offer();

            self.occupantListener(self.occupants);
          });

          roomRef.on("child_removed", function (data) {
            var remoteId = data.key;

            if (remoteId === self.localId || remoteId === "timestamp" || self.peers[remoteId] === undefined) return;

            delete self.peers[remoteId];
            delete self.occupants[remoteId];

            self.occupantListener(self.occupants);
          });

          self.connectSuccess(self.localId);
        });
      });
    }
  }, {
    key: "shouldStartConnectionTo",
    value: function shouldStartConnectionTo(client) {
      return (this.myRoomJoinTime || 0) <= (client ? client.roomJoinTime : 0);
    }
  }, {
    key: "startStreamConnection",
    value: function startStreamConnection(clientId) {
      // Handled by WebRtcPeer
    }
  }, {
    key: "closeStreamConnection",
    value: function closeStreamConnection(clientId) {
      // Handled by WebRtcPeer
    }
  }, {
    key: "sendData",
    value: function sendData(clientId, dataType, data) {
      this.peers[clientId].send(dataType, data);
    }
  }, {
    key: "sendDataGuaranteed",
    value: function sendDataGuaranteed(clientId, dataType, data) {
      var clonedData = JSON.parse(JSON.stringify(data));
      var encodedData = firebaseKeyEncode.deepEncode(clonedData);
      this.firebaseApp.database().ref(this.getDataPath(this.localId)).set({
        to: clientId,
        type: dataType,
        data: encodedData
      });
    }
  }, {
    key: "broadcastData",
    value: function broadcastData(dataType, data) {
      for (var clientId in this.peers) {
        if (this.peers.hasOwnProperty(clientId)) {
          this.sendData(clientId, dataType, data);
        }
      }
    }
  }, {
    key: "broadcastDataGuaranteed",
    value: function broadcastDataGuaranteed(dataType, data) {
      for (var clientId in this.peers) {
        if (this.peers.hasOwnProperty(clientId)) {
          this.sendDataGuaranteed(clientId, dataType, data);
        }
      }
    }
  }, {
    key: "getConnectStatus",
    value: function getConnectStatus(clientId) {
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

  }, {
    key: "initFirebase",
    value: function initFirebase(callback) {
      this.firebaseApp = this.firebase.initializeApp({
        apiKey: this.apiKey,
        authDomain: this.authDomain,
        databaseURL: this.databaseURL
      }, this.appId);

      this.auth(this.authType, callback);
    }
  }, {
    key: "auth",
    value: function auth(type, callback) {
      switch (type) {
        case "none":
          this.authNone(callback);
          break;

        case "anonymous":
          this.authAnonymous(callback);
          break;

        // TODO: support other auth type
        default:
          console.log("FirebaseWebRtcInterface.auth: Unknown authType " + type);
          break;
      }
    }
  }, {
    key: "authNone",
    value: function authNone(callback) {
      var self = this;

      // asynchronously invokes open listeners for the compatibility with other auth types.
      // TODO: generate not just random but also unique id
      requestAnimationFrame(function () {
        callback(self.randomString());
      });
    }
  }, {
    key: "authAnonymous",
    value: function authAnonymous(callback) {
      var self = this;
      var firebaseApp = this.firebaseApp;

      firebaseApp.auth().signInAnonymously().catch(function (error) {
        console.error("FirebaseWebRtcInterface.authAnonymous: " + error);
        self.connectFailure(null, error);
      });

      firebaseApp.auth().onAuthStateChanged(function (user) {
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

  }, {
    key: "getRootPath",
    value: function getRootPath() {
      return this.rootPath;
    }
  }, {
    key: "getAppPath",
    value: function getAppPath() {
      return this.getRootPath() + "/" + this.appId;
    }
  }, {
    key: "getRoomPath",
    value: function getRoomPath() {
      return this.getAppPath() + "/" + this.roomId;
    }
  }, {
    key: "getUserPath",
    value: function getUserPath(id) {
      return this.getRoomPath() + "/" + id;
    }
  }, {
    key: "getSignalPath",
    value: function getSignalPath(id) {
      return this.getUserPath(id) + "/signal";
    }
  }, {
    key: "getDataPath",
    value: function getDataPath(id) {
      return this.getUserPath(id) + "/data";
    }
  }, {
    key: "getTimestampGenerationPath",
    value: function getTimestampGenerationPath(id) {
      return this.getRoomPath() + "/timestamp/" + id;
    }
  }, {
    key: "randomString",
    value: function randomString() {
      var stringLength = 16;
      var chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz0123456789";
      var string = "";

      for (var i = 0; i < stringLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        string += chars.substring(randomNumber, randomNumber + 1);
      }

      return string;
    }
  }, {
    key: "getTimestamp",
    value: function getTimestamp(callback) {
      var firebaseApp = this.firebaseApp;
      var ref = firebaseApp.database().ref(this.getTimestampGenerationPath(this.localId));
      ref.set(this.firebase.database.ServerValue.TIMESTAMP);
      ref.once("value", function (data) {
        var timestamp = data.val();
        ref.remove();
        callback(timestamp);
      });
      ref.onDisconnect().remove();
    }
  }]);

  return FirebaseWebRtcAdapter;
}();

NAF.adapters.register("firebase", FirebaseWebRtcAdapter);

module.exports = FirebaseWebRtcAdapter;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = {
    encode: function (decoded) {
        return encodeURIComponent(decoded).replace(/\./g, '%2E');
    },
    decode: function (encoded) {
        return decodeURIComponent(encoded.replace('%2E', '.'));
    },
    // Replaces the key with `fn(key)` on each key in an object tree.
    // i.e. making all keys uppercase.
    deepKeyReplace: function (obj, fn) {
        var rebuiltTree = Object.assign({}, obj);

        function traverse(o, x, func) {
            if (typeof(o) === "object") {
                for (var i in o) {
                    if (o[i] !== null && (typeof(o[i])=="object" || Array.isArray(o[i]))) {
                        //going on step down in the object tree!!
                        traverse(o[i],x[i],func);
                    }
                    func.apply(this,[x, i, x[i]]);
                }
            } else if (Array.isArray(o)) {
                for (var i = 0; i < o.length; i++) {
                    // func.apply(this,[o, i,o[i]]);
                    if (o[i] !== null && (typeof(o[i])=="object" || Array.isArray(o[i]))) {
                        //going on step down in the object tree!!
                        traverse(o[i], x[i], func);
                    }
                }
            }
        }

        traverse(obj, rebuiltTree, function (parent, key, val) {
            delete parent[key];
            parent[fn(key)] = val;
        });

        return rebuiltTree;
    },
    deepDecode: function (encodedTree) {
        var $this = this;

        var rebuiltTree = this.deepKeyReplace(encodedTree, function (key) {
            return $this.decode(key);
        });

        return rebuiltTree;
    },
    deepEncode: function (decodedTree) {
        var $this = this;

        var rebuiltTree = this.deepKeyReplace(decodedTree, function (key) {
            return $this.encode(key);
        });

        return rebuiltTree;
    }
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebRtcPeer = function () {
  function WebRtcPeer(localId, remoteId, sendSignalFunc) {
    _classCallCheck(this, WebRtcPeer);

    this.localId = localId;
    this.remoteId = remoteId;
    this.sendSignalFunc = sendSignalFunc;
    this.open = false;
    this.channelLabel = "networked-aframe-channel";

    this.pc = this.createPeerConnection();
    this.channel = null;
  }

  _createClass(WebRtcPeer, [{
    key: "setDatachannelListeners",
    value: function setDatachannelListeners(openListener, closedListener, messageListener) {
      this.openListener = openListener;
      this.closedListener = closedListener;
      this.messageListener = messageListener;
    }
  }, {
    key: "offer",
    value: function offer() {
      var self = this;
      // reliable: false - UDP
      this.setupChannel(this.pc.createDataChannel(this.channelLabel, { reliable: false }));
      this.pc.createOffer(function (sdp) {
        self.handleSessionDescription(sdp);
      }, function (error) {
        console.error("WebRtcPeer.offer: " + error);
      });
    }
  }, {
    key: "handleSignal",
    value: function handleSignal(signal) {
      // ignores signal if it isn't for me
      if (this.localId !== signal.to || this.remoteId !== signal.from) return;

      switch (signal.type) {
        case "offer":
          this.handleOffer(signal);
          break;

        case "answer":
          this.handleAnswer(signal);
          break;

        case "candidate":
          this.handleCandidate(signal);
          break;

        default:
          console.error("WebRtcPeer.handleSignal: Unknown signal type " + signal.type);
          break;
      }
    }
  }, {
    key: "send",
    value: function send(type, data) {
      // TODO: throw error?
      if (this.channel === null || this.channel.readyState !== "open") return;

      this.channel.send(JSON.stringify({ type: type, data: data }));
    }
  }, {
    key: "getStatus",
    value: function getStatus() {
      if (this.channel === null) return WebRtcPeer.NOT_CONNECTED;

      switch (this.channel.readyState) {
        case "open":
          return WebRtcPeer.IS_CONNECTED;

        case "connecting":
          return WebRtcPeer.CONNECTING;

        case "closing":
        case "closed":
        default:
          return WebRtcPeer.NOT_CONNECTED;
      }
    }

    /*
       * Privates
       */

  }, {
    key: "createPeerConnection",
    value: function createPeerConnection() {
      var self = this;
      var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection || window.msRTCPeerConnection;

      if (RTCPeerConnection === undefined) {
        throw new Error("WebRtcPeer.createPeerConnection: This browser does not seem to support WebRTC.");
      }

      var pc = new RTCPeerConnection({ iceServers: WebRtcPeer.ICE_SERVERS });

      pc.onicecandidate = function (event) {
        if (event.candidate) {
          self.sendSignalFunc({
            from: self.localId,
            to: self.remoteId,
            type: "candidate",
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            candidate: event.candidate.candidate
          });
        }
      };

      // Note: seems like channel.onclose hander is unreliable on some platforms,
      //       so also tries to detect disconnection here.
      pc.oniceconnectionstatechange = function () {
        if (self.open && pc.iceConnectionState === "disconnected") {
          self.open = false;
          self.closedListener(self.remoteId);
        }
      };

      return pc;
    }
  }, {
    key: "setupChannel",
    value: function setupChannel(channel) {
      var self = this;

      this.channel = channel;

      // received data from a remote peer
      this.channel.onmessage = function (event) {
        var data = JSON.parse(event.data);
        self.messageListener(self.remoteId, data.type, data.data);
      };

      // connected with a remote peer
      this.channel.onopen = function (event) {
        self.open = true;
        self.openListener(self.remoteId);
      };

      // disconnected with a remote peer
      this.channel.onclose = function (event) {
        if (!self.open) return;
        self.open = false;
        self.closedListener(self.remoteId);
      };

      // error occurred with a remote peer
      this.channel.onerror = function (error) {
        console.error("WebRtcPeer.channel.onerror: " + error);
      };
    }
  }, {
    key: "handleOffer",
    value: function handleOffer(message) {
      var self = this;

      this.pc.ondatachannel = function (event) {
        self.setupChannel(event.channel);
      };

      this.setRemoteDescription(message);

      this.pc.createAnswer(function (sdp) {
        self.handleSessionDescription(sdp);
      }, function (error) {
        console.error("WebRtcPeer.handleOffer: " + error);
      });
    }
  }, {
    key: "handleAnswer",
    value: function handleAnswer(message) {
      this.setRemoteDescription(message);
    }
  }, {
    key: "handleCandidate",
    value: function handleCandidate(message) {
      var self = this;
      var RTCIceCandidate = window.RTCIceCandidate || window.webkitRTCIceCandidate || window.mozRTCIceCandidate;

      this.pc.addIceCandidate(new RTCIceCandidate(message), function () {}, function (error) {
        console.error("WebRtcPeer.handleCandidate: " + error);
      });
    }
  }, {
    key: "handleSessionDescription",
    value: function handleSessionDescription(sdp) {
      var self = this;

      this.pc.setLocalDescription(sdp, function () {}, function (error) {
        console.error("WebRtcPeer.handleSessionDescription: " + error);
      });

      this.sendSignalFunc({
        from: this.localId,
        to: this.remoteId,
        type: sdp.type,
        sdp: sdp.sdp
      });
    }
  }, {
    key: "setRemoteDescription",
    value: function setRemoteDescription(message) {
      var self = this;
      var RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription || window.msRTCSessionDescription;

      this.pc.setRemoteDescription(new RTCSessionDescription(message), function () {}, function (error) {
        console.error("WebRtcPeer.setRemoteDescription: " + error);
      });
    }
  }]);

  return WebRtcPeer;
}();

WebRtcPeer.IS_CONNECTED = "IS_CONNECTED";
WebRtcPeer.CONNECTING = "CONNECTING";
WebRtcPeer.NOT_CONNECTED = "NOT_CONNECTED";

WebRtcPeer.ICE_SERVERS = [{ urls: "stun:stun1.l.google.com:19302" }, { urls: "stun:stun2.l.google.com:19302" }, { urls: "stun:stun3.l.google.com:19302" }, { urls: "stun:stun4.l.google.com:19302" }];

module.exports = WebRtcPeer;

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZDBjMDljZTViNjRhMTY3YmYzNWIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9maXJlYmFzZS1rZXktZW5jb2RlL2ZpcmViYXNlLWtleS1lbmNvZGUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1dlYlJ0Y1BlZXIuanMiXSwibmFtZXMiOlsiZmlyZWJhc2VLZXlFbmNvZGUiLCJyZXF1aXJlIiwiV2ViUnRjUGVlciIsIkZpcmViYXNlV2ViUnRjQWRhcHRlciIsImZpcmViYXNlIiwiY29uZmlnIiwicm9vdFBhdGgiLCJsb2NhbElkIiwiYXBwSWQiLCJyb29tSWQiLCJwZWVycyIsIm9jY3VwYW50cyIsIndpbmRvdyIsImZpcmViYXNlQ29uZmlnIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJhdXRoVHlwZSIsImFwaUtleSIsImF1dGhEb21haW4iLCJkYXRhYmFzZVVSTCIsInVybCIsIm9wdGlvbnMiLCJkYXRhY2hhbm5lbCIsImNvbnNvbGUiLCJ3YXJuIiwiYXVkaW8iLCJ2aWRlbyIsInN1Y2Nlc3NMaXN0ZW5lciIsImZhaWx1cmVMaXN0ZW5lciIsImNvbm5lY3RTdWNjZXNzIiwiY29ubmVjdEZhaWx1cmUiLCJvY2N1cGFudExpc3RlbmVyIiwib3Blbkxpc3RlbmVyIiwiY2xvc2VkTGlzdGVuZXIiLCJtZXNzYWdlTGlzdGVuZXIiLCJyZW1vdGVJZCIsImRhdGFUeXBlIiwiZGF0YSIsImRlY29kZWREYXRhIiwiZGVlcERlY29kZSIsInNlbGYiLCJpbml0RmlyZWJhc2UiLCJpZCIsImZpcmViYXNlQXBwIiwiZ2V0VGltZXN0YW1wIiwidGltZXN0YW1wIiwibXlSb29tSm9pblRpbWUiLCJ1c2VyUmVmIiwiZGF0YWJhc2UiLCJyZWYiLCJnZXRVc2VyUGF0aCIsInNldCIsInNpZ25hbCIsIm9uRGlzY29ubmVjdCIsInJlbW92ZSIsInJvb21SZWYiLCJnZXRSb29tUGF0aCIsIm9uIiwia2V5IiwicmVtb3RlVGltZXN0YW1wIiwidmFsIiwicGVlciIsImdldFNpZ25hbFBhdGgiLCJzZXREYXRhY2hhbm5lbExpc3RlbmVycyIsInZhbHVlIiwiaGFuZGxlU2lnbmFsIiwiZ2V0RGF0YVBhdGgiLCJ0byIsInR5cGUiLCJvZmZlciIsImNsaWVudCIsInJvb21Kb2luVGltZSIsImNsaWVudElkIiwic2VuZCIsImNsb25lZERhdGEiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJlbmNvZGVkRGF0YSIsImRlZXBFbmNvZGUiLCJoYXNPd25Qcm9wZXJ0eSIsInNlbmREYXRhIiwic2VuZERhdGFHdWFyYW50ZWVkIiwiTkFGIiwiYWRhcHRlcnMiLCJOT1RfQ09OTkVDVEVEIiwiZ2V0U3RhdHVzIiwiSVNfQ09OTkVDVEVEIiwiQ09OTkVDVElORyIsImNhbGxiYWNrIiwiaW5pdGlhbGl6ZUFwcCIsImF1dGgiLCJhdXRoTm9uZSIsImF1dGhBbm9ueW1vdXMiLCJsb2ciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJyYW5kb21TdHJpbmciLCJzaWduSW5Bbm9ueW1vdXNseSIsImNhdGNoIiwiZXJyb3IiLCJvbkF1dGhTdGF0ZUNoYW5nZWQiLCJ1c2VyIiwidWlkIiwiZ2V0Um9vdFBhdGgiLCJnZXRBcHBQYXRoIiwic3RyaW5nTGVuZ3RoIiwiY2hhcnMiLCJzdHJpbmciLCJpIiwicmFuZG9tTnVtYmVyIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwibGVuZ3RoIiwic3Vic3RyaW5nIiwiZ2V0VGltZXN0YW1wR2VuZXJhdGlvblBhdGgiLCJTZXJ2ZXJWYWx1ZSIsIlRJTUVTVEFNUCIsIm9uY2UiLCJyZWdpc3RlciIsIm1vZHVsZSIsImV4cG9ydHMiLCJzZW5kU2lnbmFsRnVuYyIsIm9wZW4iLCJjaGFubmVsTGFiZWwiLCJwYyIsImNyZWF0ZVBlZXJDb25uZWN0aW9uIiwiY2hhbm5lbCIsInNldHVwQ2hhbm5lbCIsImNyZWF0ZURhdGFDaGFubmVsIiwicmVsaWFibGUiLCJjcmVhdGVPZmZlciIsInNkcCIsImhhbmRsZVNlc3Npb25EZXNjcmlwdGlvbiIsImZyb20iLCJoYW5kbGVPZmZlciIsImhhbmRsZUFuc3dlciIsImhhbmRsZUNhbmRpZGF0ZSIsInJlYWR5U3RhdGUiLCJSVENQZWVyQ29ubmVjdGlvbiIsIndlYmtpdFJUQ1BlZXJDb25uZWN0aW9uIiwibW96UlRDUGVlckNvbm5lY3Rpb24iLCJtc1JUQ1BlZXJDb25uZWN0aW9uIiwiaWNlU2VydmVycyIsIklDRV9TRVJWRVJTIiwib25pY2VjYW5kaWRhdGUiLCJldmVudCIsImNhbmRpZGF0ZSIsInNkcE1MaW5lSW5kZXgiLCJvbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSIsImljZUNvbm5lY3Rpb25TdGF0ZSIsIm9ubWVzc2FnZSIsIm9ub3BlbiIsIm9uY2xvc2UiLCJvbmVycm9yIiwibWVzc2FnZSIsIm9uZGF0YWNoYW5uZWwiLCJzZXRSZW1vdGVEZXNjcmlwdGlvbiIsImNyZWF0ZUFuc3dlciIsIlJUQ0ljZUNhbmRpZGF0ZSIsIndlYmtpdFJUQ0ljZUNhbmRpZGF0ZSIsIm1velJUQ0ljZUNhbmRpZGF0ZSIsImFkZEljZUNhbmRpZGF0ZSIsInNldExvY2FsRGVzY3JpcHRpb24iLCJSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJ3ZWJraXRSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJtb3pSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJtc1JUQ1Nlc3Npb25EZXNjcmlwdGlvbiIsInVybHMiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFp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RSxDQUZmLEVBR0UsVUFBU3hELEtBQVQsRUFBZ0I7QUFDZDVFLGdCQUFRNEUsS0FBUixDQUFjLHNDQUFzQ0EsS0FBcEQ7QUFDRCxPQUxIO0FBT0Q7Ozs7OztBQUdIakcsV0FBV3FGLFlBQVgsR0FBMEIsY0FBMUI7QUFDQXJGLFdBQVdzRixVQUFYLEdBQXdCLFlBQXhCO0FBQ0F0RixXQUFXbUYsYUFBWCxHQUEyQixlQUEzQjs7QUFFQW5GLFdBQVc4SSxXQUFYLEdBQXlCLENBQ3ZCLEVBQUV3QixNQUFNLCtCQUFSLEVBRHVCLEVBRXZCLEVBQUVBLE1BQU0sK0JBQVIsRUFGdUIsRUFHdkIsRUFBRUEsTUFBTSwrQkFBUixFQUh1QixFQUl2QixFQUFFQSxNQUFNLCtCQUFSLEVBSnVCLENBQXpCOztBQU9BaEQsT0FBT0MsT0FBUCxHQUFpQnZILFVBQWpCLEMiLCJmaWxlIjoibmFmLWZpcmViYXNlLWFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAwKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBkMGMwOWNlNWI2NGExNjdiZjM1YiIsImNvbnN0IGZpcmViYXNlS2V5RW5jb2RlID0gcmVxdWlyZShcImZpcmViYXNlLWtleS1lbmNvZGVcIik7XHJcbmNvbnN0IFdlYlJ0Y1BlZXIgPSByZXF1aXJlKFwiLi9XZWJSdGNQZWVyXCIpO1xyXG5cclxuY2xhc3MgRmlyZWJhc2VXZWJSdGNBZGFwdGVyIHtcclxuICAvKipcclxuICAgIENvbmZpZyBzdHJ1Y3R1cmU6XHJcbiAgICBjb25maWcuYXV0aFR5cGU6IG5vbmU7XHJcbiAgICBjb25maWcuYXBpS2V5OiB5b3VyLWFwaTtcclxuICAgIGNvbmZpZy5hdXRoRG9tYWluOiB5b3VyLXByb2plY3QuZmlyZWJhc2VhcHAuY29tO1xyXG4gICAgY29uZmlnLmRhdGFiYXNlVVJMOiBodHRwczovL3lvdXItcHJvamVjdC5maXJlYmFzZWlvLmNvbTtcclxuICAqL1xyXG4gIGNvbnN0cnVjdG9yKGZpcmViYXNlLCBjb25maWcpIHtcclxuICAgIHRoaXMucm9vdFBhdGggPSBcIm5ldHdvcmtlZC1hZnJhbWVcIjtcclxuXHJcbiAgICB0aGlzLmxvY2FsSWQgPSBudWxsO1xyXG4gICAgdGhpcy5hcHBJZCA9IG51bGw7XHJcbiAgICB0aGlzLnJvb21JZCA9IG51bGw7XHJcblxyXG4gICAgdGhpcy5wZWVycyA9IHt9OyAvLyBpZCAtPiBXZWJSdGNQZWVyXHJcbiAgICB0aGlzLm9jY3VwYW50cyA9IHt9OyAvLyBpZCAtPiBqb2luVGltZXN0YW1wXHJcblxyXG4gICAgY29uZmlnID0gY29uZmlnIHx8IHdpbmRvdy5maXJlYmFzZUNvbmZpZztcclxuICAgIHRoaXMuZmlyZWJhc2UgPSBmaXJlYmFzZSB8fCB3aW5kb3cuZmlyZWJhc2U7XHJcblxyXG4gICAgaWYgKHRoaXMuZmlyZWJhc2UgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgXCJJbXBvcnQgaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vZmlyZWJhc2Vqcy94LngueC9maXJlYmFzZS5qc1wiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5hdXRoVHlwZSA9IGNvbmZpZy5hdXRoVHlwZTtcclxuICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcclxuICAgIHRoaXMuYXV0aERvbWFpbiA9IGNvbmZpZy5hdXRoRG9tYWluO1xyXG4gICAgdGhpcy5kYXRhYmFzZVVSTCA9IGNvbmZpZy5kYXRhYmFzZVVSTDtcclxuICB9XHJcblxyXG4gIC8qXHJcbiAgICogQ2FsbCBiZWZvcmUgYGNvbm5lY3RgXHJcbiAgICovXHJcblxyXG4gIHNldFNlcnZlclVybCh1cmwpIHtcclxuICAgIC8vIGhhbmRsZWQgaW4gY29uZmlnXHJcbiAgfVxyXG5cclxuICBzZXRBcHAoYXBwSWQpIHtcclxuICAgIHRoaXMuYXBwSWQgPSBhcHBJZDtcclxuICB9XHJcblxyXG4gIHNldFJvb20ocm9vbUlkKSB7XHJcbiAgICB0aGlzLnJvb21JZCA9IHJvb21JZDtcclxuICB9XHJcblxyXG4gIC8vIG9wdGlvbnM6IHsgZGF0YWNoYW5uZWw6IGJvb2wsIGF1ZGlvOiBib29sIH1cclxuICBzZXRXZWJSdGNPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIC8vIFRPRE86IHN1cHBvcnQgYXVkaW8gYW5kIHZpZGVvXHJcbiAgICBpZiAob3B0aW9ucy5kYXRhY2hhbm5lbCA9PT0gZmFsc2UpXHJcbiAgICAgIGNvbnNvbGUud2FybihcclxuICAgICAgICBcIkZpcmViYXNlV2ViUnRjQWRhcHRlci5zZXRXZWJSdGNPcHRpb25zOiBkYXRhY2hhbm5lbCBtdXN0IGJlIHRydWUuXCJcclxuICAgICAgKTtcclxuICAgIGlmIChvcHRpb25zLmF1ZGlvID09PSB0cnVlKVxyXG4gICAgICBjb25zb2xlLndhcm4oXCJGaXJlYmFzZVdlYlJ0Y0FkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCBhdWRpbyB5ZXQuXCIpO1xyXG4gICAgaWYgKG9wdGlvbnMudmlkZW8gPT09IHRydWUpXHJcbiAgICAgIGNvbnNvbGUud2FybihcIkZpcmViYXNlV2ViUnRjQWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IHZpZGVvIHlldC5cIik7XHJcbiAgfVxyXG5cclxuICBzZXRTZXJ2ZXJDb25uZWN0TGlzdGVuZXJzKHN1Y2Nlc3NMaXN0ZW5lciwgZmFpbHVyZUxpc3RlbmVyKSB7XHJcbiAgICB0aGlzLmNvbm5lY3RTdWNjZXNzID0gc3VjY2Vzc0xpc3RlbmVyO1xyXG4gICAgdGhpcy5jb25uZWN0RmFpbHVyZSA9IGZhaWx1cmVMaXN0ZW5lcjtcclxuICB9XHJcblxyXG4gIHNldFJvb21PY2N1cGFudExpc3RlbmVyKG9jY3VwYW50TGlzdGVuZXIpIHtcclxuICAgIHRoaXMub2NjdXBhbnRMaXN0ZW5lciA9IG9jY3VwYW50TGlzdGVuZXI7XHJcbiAgfVxyXG5cclxuICBzZXREYXRhQ2hhbm5lbExpc3RlbmVycyhvcGVuTGlzdGVuZXIsIGNsb3NlZExpc3RlbmVyLCBtZXNzYWdlTGlzdGVuZXIpIHtcclxuICAgIHRoaXMub3Blbkxpc3RlbmVyID0gb3Blbkxpc3RlbmVyO1xyXG4gICAgdGhpcy5jbG9zZWRMaXN0ZW5lciA9IGNsb3NlZExpc3RlbmVyO1xyXG4gICAgdGhpcy5tZXNzYWdlTGlzdGVuZXIgPSBmdW5jdGlvbihyZW1vdGVJZCwgZGF0YVR5cGUsIGRhdGEpIHtcclxuICAgICAgdmFyIGRlY29kZWREYXRhID0gZmlyZWJhc2VLZXlFbmNvZGUuZGVlcERlY29kZShkYXRhKTtcclxuICAgICAgbWVzc2FnZUxpc3RlbmVyKHJlbW90ZUlkLCBkYXRhVHlwZSwgZGVjb2RlZERhdGEpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGNvbm5lY3QoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5pbml0RmlyZWJhc2UoZnVuY3Rpb24oaWQpIHtcclxuICAgICAgc2VsZi5sb2NhbElkID0gaWQ7XHJcbiAgICAgIHZhciBmaXJlYmFzZUFwcCA9IHNlbGYuZmlyZWJhc2VBcHA7XHJcblxyXG4gICAgICAvLyBOb3RlOiBhc3N1bWluZyB0aGF0IGRhdGEgdHJhbnNmZXIgdmlhIGZpcmViYXNlIHJlYWx0aW1lIGRhdGFiYXNlXHJcbiAgICAgIC8vICAgICAgIGlzIHJlbGlhYmxlIGFuZCBpbiBvcmRlclxyXG4gICAgICAvLyBUT0RPOiBjYW4gcmFjZSBhbW9uZyBwZWVycz8gSWYgc28sIGZpeFxyXG5cclxuICAgICAgc2VsZi5nZXRUaW1lc3RhbXAoZnVuY3Rpb24odGltZXN0YW1wKSB7XHJcbiAgICAgICAgc2VsZi5teVJvb21Kb2luVGltZSA9IHRpbWVzdGFtcDtcclxuXHJcbiAgICAgICAgdmFyIHVzZXJSZWYgPSBmaXJlYmFzZUFwcFxyXG4gICAgICAgICAgLmRhdGFiYXNlKClcclxuICAgICAgICAgIC5yZWYoc2VsZi5nZXRVc2VyUGF0aChzZWxmLmxvY2FsSWQpKTtcclxuICAgICAgICB1c2VyUmVmLnNldCh7IHRpbWVzdGFtcDogdGltZXN0YW1wLCBzaWduYWw6IFwiXCIsIGRhdGE6IFwiXCIgfSk7XHJcbiAgICAgICAgdXNlclJlZi5vbkRpc2Nvbm5lY3QoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgdmFyIHJvb21SZWYgPSBmaXJlYmFzZUFwcC5kYXRhYmFzZSgpLnJlZihzZWxmLmdldFJvb21QYXRoKCkpO1xyXG5cclxuICAgICAgICByb29tUmVmLm9uKFwiY2hpbGRfYWRkZWRcIiwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgdmFyIHJlbW90ZUlkID0gZGF0YS5rZXk7XHJcblxyXG4gICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICByZW1vdGVJZCA9PT0gc2VsZi5sb2NhbElkIHx8XHJcbiAgICAgICAgICAgIHJlbW90ZUlkID09PSBcInRpbWVzdGFtcFwiIHx8XHJcbiAgICAgICAgICAgIHNlbGYucGVlcnNbcmVtb3RlSWRdICE9PSB1bmRlZmluZWRcclxuICAgICAgICAgIClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICAgIHZhciByZW1vdGVUaW1lc3RhbXAgPSBkYXRhLnZhbCgpLnRpbWVzdGFtcDtcclxuXHJcbiAgICAgICAgICB2YXIgcGVlciA9IG5ldyBXZWJSdGNQZWVyKFxyXG4gICAgICAgICAgICBzZWxmLmxvY2FsSWQsXHJcbiAgICAgICAgICAgIHJlbW90ZUlkLFxyXG4gICAgICAgICAgICAvLyBzZW5kIHNpZ25hbCBmdW5jdGlvblxyXG4gICAgICAgICAgICBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICAgICAgZmlyZWJhc2VBcHBcclxuICAgICAgICAgICAgICAgIC5kYXRhYmFzZSgpXHJcbiAgICAgICAgICAgICAgICAucmVmKHNlbGYuZ2V0U2lnbmFsUGF0aChzZWxmLmxvY2FsSWQpKVxyXG4gICAgICAgICAgICAgICAgLnNldChkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHBlZXIuc2V0RGF0YWNoYW5uZWxMaXN0ZW5lcnMoXHJcbiAgICAgICAgICAgIHNlbGYub3Blbkxpc3RlbmVyLFxyXG4gICAgICAgICAgICBzZWxmLmNsb3NlZExpc3RlbmVyLFxyXG4gICAgICAgICAgICBzZWxmLm1lc3NhZ2VMaXN0ZW5lclxyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBzZWxmLnBlZXJzW3JlbW90ZUlkXSA9IHBlZXI7XHJcbiAgICAgICAgICBzZWxmLm9jY3VwYW50c1tyZW1vdGVJZF0gPSByZW1vdGVUaW1lc3RhbXA7XHJcblxyXG4gICAgICAgICAgLy8gcmVjZWl2ZWQgc2lnbmFsXHJcbiAgICAgICAgICBmaXJlYmFzZUFwcFxyXG4gICAgICAgICAgICAuZGF0YWJhc2UoKVxyXG4gICAgICAgICAgICAucmVmKHNlbGYuZ2V0U2lnbmFsUGF0aChyZW1vdGVJZCkpXHJcbiAgICAgICAgICAgIC5vbihcInZhbHVlXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkYXRhLnZhbCgpO1xyXG4gICAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gXCJcIikgcmV0dXJuO1xyXG4gICAgICAgICAgICAgIHBlZXIuaGFuZGxlU2lnbmFsKHZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gcmVjZWl2ZWQgZGF0YVxyXG4gICAgICAgICAgZmlyZWJhc2VBcHBcclxuICAgICAgICAgICAgLmRhdGFiYXNlKClcclxuICAgICAgICAgICAgLnJlZihzZWxmLmdldERhdGFQYXRoKHJlbW90ZUlkKSlcclxuICAgICAgICAgICAgLm9uKFwidmFsdWVcIiwgZnVuY3Rpb24oZGF0YSkge1xyXG4gICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGRhdGEudmFsKCk7XHJcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiIHx8IHZhbHVlLnRvICE9PSBzZWxmLmxvY2FsSWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgc2VsZi5tZXNzYWdlTGlzdGVuZXIocmVtb3RlSWQsIHZhbHVlLnR5cGUsIHZhbHVlLmRhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBzZW5kIG9mZmVyIGZyb20gYSBwZWVyIHdob1xyXG4gICAgICAgICAgLy8gICAtIGxhdGVyIGpvaW5lZCB0aGUgcm9vbSwgb3JcclxuICAgICAgICAgIC8vICAgLSBoYXMgbGFyZ2VyIGlkIGlmIHR3byBwZWVycyBqb2luZWQgdGhlIHJvb20gYXQgc2FtZSB0aW1lXHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHRpbWVzdGFtcCA+IHJlbW90ZVRpbWVzdGFtcCB8fFxyXG4gICAgICAgICAgICAodGltZXN0YW1wID09PSByZW1vdGVUaW1lc3RhbXAgJiYgc2VsZi5sb2NhbElkID4gcmVtb3RlSWQpXHJcbiAgICAgICAgICApXHJcbiAgICAgICAgICAgIHBlZXIub2ZmZXIoKTtcclxuXHJcbiAgICAgICAgICBzZWxmLm9jY3VwYW50TGlzdGVuZXIoc2VsZi5vY2N1cGFudHMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByb29tUmVmLm9uKFwiY2hpbGRfcmVtb3ZlZFwiLCBmdW5jdGlvbihkYXRhKSB7XHJcbiAgICAgICAgICB2YXIgcmVtb3RlSWQgPSBkYXRhLmtleTtcclxuXHJcbiAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgIHJlbW90ZUlkID09PSBzZWxmLmxvY2FsSWQgfHxcclxuICAgICAgICAgICAgcmVtb3RlSWQgPT09IFwidGltZXN0YW1wXCIgfHxcclxuICAgICAgICAgICAgc2VsZi5wZWVyc1tyZW1vdGVJZF0gPT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgICAgZGVsZXRlIHNlbGYucGVlcnNbcmVtb3RlSWRdO1xyXG4gICAgICAgICAgZGVsZXRlIHNlbGYub2NjdXBhbnRzW3JlbW90ZUlkXTtcclxuXHJcbiAgICAgICAgICBzZWxmLm9jY3VwYW50TGlzdGVuZXIoc2VsZi5vY2N1cGFudHMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBzZWxmLmNvbm5lY3RTdWNjZXNzKHNlbGYubG9jYWxJZCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBzaG91bGRTdGFydENvbm5lY3Rpb25UbyhjbGllbnQpIHtcclxuICAgIHJldHVybiAodGhpcy5teVJvb21Kb2luVGltZSB8fCAwKSA8PSAoY2xpZW50ID8gY2xpZW50LnJvb21Kb2luVGltZSA6IDApO1xyXG4gIH1cclxuXHJcbiAgc3RhcnRTdHJlYW1Db25uZWN0aW9uKGNsaWVudElkKSB7XHJcbiAgICAvLyBIYW5kbGVkIGJ5IFdlYlJ0Y1BlZXJcclxuICB9XHJcblxyXG4gIGNsb3NlU3RyZWFtQ29ubmVjdGlvbihjbGllbnRJZCkge1xyXG4gICAgLy8gSGFuZGxlZCBieSBXZWJSdGNQZWVyXHJcbiAgfVxyXG5cclxuICBzZW5kRGF0YShjbGllbnRJZCwgZGF0YVR5cGUsIGRhdGEpIHtcclxuICAgIHRoaXMucGVlcnNbY2xpZW50SWRdLnNlbmQoZGF0YVR5cGUsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgc2VuZERhdGFHdWFyYW50ZWVkKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSkge1xyXG4gICAgdmFyIGNsb25lZERhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcclxuICAgIHZhciBlbmNvZGVkRGF0YSA9IGZpcmViYXNlS2V5RW5jb2RlLmRlZXBFbmNvZGUoY2xvbmVkRGF0YSk7XHJcbiAgICB0aGlzLmZpcmViYXNlQXBwXHJcbiAgICAgIC5kYXRhYmFzZSgpXHJcbiAgICAgIC5yZWYodGhpcy5nZXREYXRhUGF0aCh0aGlzLmxvY2FsSWQpKVxyXG4gICAgICAuc2V0KHtcclxuICAgICAgICB0bzogY2xpZW50SWQsXHJcbiAgICAgICAgdHlwZTogZGF0YVR5cGUsXHJcbiAgICAgICAgZGF0YTogZW5jb2RlZERhdGFcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICBicm9hZGNhc3REYXRhKGRhdGFUeXBlLCBkYXRhKSB7XHJcbiAgICBmb3IgKHZhciBjbGllbnRJZCBpbiB0aGlzLnBlZXJzKSB7XHJcbiAgICAgIGlmICh0aGlzLnBlZXJzLmhhc093blByb3BlcnR5KGNsaWVudElkKSkge1xyXG4gICAgICAgIHRoaXMuc2VuZERhdGEoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYnJvYWRjYXN0RGF0YUd1YXJhbnRlZWQoZGF0YVR5cGUsIGRhdGEpIHtcclxuICAgIGZvciAodmFyIGNsaWVudElkIGluIHRoaXMucGVlcnMpIHtcclxuICAgICAgaWYgKHRoaXMucGVlcnMuaGFzT3duUHJvcGVydHkoY2xpZW50SWQpKSB7XHJcbiAgICAgICAgdGhpcy5zZW5kRGF0YUd1YXJhbnRlZWQoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0Q29ubmVjdFN0YXR1cyhjbGllbnRJZCkge1xyXG4gICAgdmFyIHBlZXIgPSB0aGlzLnBlZXJzW2NsaWVudElkXTtcclxuXHJcbiAgICBpZiAocGVlciA9PT0gdW5kZWZpbmVkKSByZXR1cm4gTkFGLmFkYXB0ZXJzLk5PVF9DT05ORUNURUQ7XHJcblxyXG4gICAgc3dpdGNoIChwZWVyLmdldFN0YXR1cygpKSB7XHJcbiAgICAgIGNhc2UgV2ViUnRjUGVlci5JU19DT05ORUNURUQ6XHJcbiAgICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5JU19DT05ORUNURUQ7XHJcblxyXG4gICAgICBjYXNlIFdlYlJ0Y1BlZXIuQ09OTkVDVElORzpcclxuICAgICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLkNPTk5FQ1RJTkc7XHJcblxyXG4gICAgICBjYXNlIFdlYlJ0Y1BlZXIuTk9UX0NPTk5FQ1RFRDpcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLk5PVF9DT05ORUNURUQ7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKlxyXG4gICAqIFByaXZhdGVzXHJcbiAgICovXHJcblxyXG4gIGluaXRGaXJlYmFzZShjYWxsYmFjaykge1xyXG4gICAgdGhpcy5maXJlYmFzZUFwcCA9IHRoaXMuZmlyZWJhc2UuaW5pdGlhbGl6ZUFwcChcclxuICAgICAge1xyXG4gICAgICAgIGFwaUtleTogdGhpcy5hcGlLZXksXHJcbiAgICAgICAgYXV0aERvbWFpbjogdGhpcy5hdXRoRG9tYWluLFxyXG4gICAgICAgIGRhdGFiYXNlVVJMOiB0aGlzLmRhdGFiYXNlVVJMXHJcbiAgICAgIH0sXHJcbiAgICAgIHRoaXMuYXBwSWRcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5hdXRoKHRoaXMuYXV0aFR5cGUsIGNhbGxiYWNrKTtcclxuICB9XHJcblxyXG4gIGF1dGgodHlwZSwgY2FsbGJhY2spIHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlIFwibm9uZVwiOlxyXG4gICAgICAgIHRoaXMuYXV0aE5vbmUoY2FsbGJhY2spO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBcImFub255bW91c1wiOlxyXG4gICAgICAgIHRoaXMuYXV0aEFub255bW91cyhjYWxsYmFjayk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IG90aGVyIGF1dGggdHlwZVxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwiRmlyZWJhc2VXZWJSdGNJbnRlcmZhY2UuYXV0aDogVW5rbm93biBhdXRoVHlwZSBcIiArIHR5cGUpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXV0aE5vbmUoY2FsbGJhY2spIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAvLyBhc3luY2hyb25vdXNseSBpbnZva2VzIG9wZW4gbGlzdGVuZXJzIGZvciB0aGUgY29tcGF0aWJpbGl0eSB3aXRoIG90aGVyIGF1dGggdHlwZXMuXHJcbiAgICAvLyBUT0RPOiBnZW5lcmF0ZSBub3QganVzdCByYW5kb20gYnV0IGFsc28gdW5pcXVlIGlkXHJcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgIGNhbGxiYWNrKHNlbGYucmFuZG9tU3RyaW5nKCkpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBhdXRoQW5vbnltb3VzKGNhbGxiYWNrKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgZmlyZWJhc2VBcHAgPSB0aGlzLmZpcmViYXNlQXBwO1xyXG5cclxuICAgIGZpcmViYXNlQXBwXHJcbiAgICAgIC5hdXRoKClcclxuICAgICAgLnNpZ25JbkFub255bW91c2x5KClcclxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkZpcmViYXNlV2ViUnRjSW50ZXJmYWNlLmF1dGhBbm9ueW1vdXM6IFwiICsgZXJyb3IpO1xyXG4gICAgICAgIHNlbGYuY29ubmVjdEZhaWx1cmUobnVsbCwgZXJyb3IpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICBmaXJlYmFzZUFwcC5hdXRoKCkub25BdXRoU3RhdGVDaGFuZ2VkKGZ1bmN0aW9uKHVzZXIpIHtcclxuICAgICAgaWYgKHVzZXIgIT09IG51bGwpIHtcclxuICAgICAgICBjYWxsYmFjayh1c2VyLnVpZCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLypcclxuICAgKiByZWFsdGltZSBkYXRhYmFzZSBsYXlvdXRcclxuICAgKlxyXG4gICAqIC9yb290UGF0aC9hcHBJZC9yb29tSWQvXHJcbiAgICogICAtIC91c2VySWQvXHJcbiAgICogICAgIC0gdGltZXN0YW1wOiBqb2luaW5nIHRoZSByb29tIHRpbWVzdGFtcFxyXG4gICAqICAgICAtIHNpZ25hbDogdXNlZCB0byBzZW5kIHNpZ25hbFxyXG4gICAqICAgICAtIGRhdGE6IHVzZWQgdG8gc2VuZCBndWFyYW50ZWVkIGRhdGFcclxuICAgKiAgIC0gL3RpbWVzdGFtcC86IHdvcmtpbmcgcGF0aCB0byBnZXQgdGltZXN0YW1wXHJcbiAgICogICAgIC0gdXNlcklkOiBcclxuICAgKi9cclxuXHJcbiAgZ2V0Um9vdFBhdGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5yb290UGF0aDtcclxuICB9XHJcblxyXG4gIGdldEFwcFBhdGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRSb290UGF0aCgpICsgXCIvXCIgKyB0aGlzLmFwcElkO1xyXG4gIH1cclxuXHJcbiAgZ2V0Um9vbVBhdGgoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRBcHBQYXRoKCkgKyBcIi9cIiArIHRoaXMucm9vbUlkO1xyXG4gIH1cclxuXHJcbiAgZ2V0VXNlclBhdGgoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFJvb21QYXRoKCkgKyBcIi9cIiArIGlkO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2lnbmFsUGF0aChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlclBhdGgoaWQpICsgXCIvc2lnbmFsXCI7XHJcbiAgfVxyXG5cclxuICBnZXREYXRhUGF0aChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0VXNlclBhdGgoaWQpICsgXCIvZGF0YVwiO1xyXG4gIH1cclxuXHJcbiAgZ2V0VGltZXN0YW1wR2VuZXJhdGlvblBhdGgoaWQpIHtcclxuICAgIHJldHVybiB0aGlzLmdldFJvb21QYXRoKCkgKyBcIi90aW1lc3RhbXAvXCIgKyBpZDtcclxuICB9XHJcblxyXG4gIHJhbmRvbVN0cmluZygpIHtcclxuICAgIHZhciBzdHJpbmdMZW5ndGggPSAxNjtcclxuICAgIHZhciBjaGFycyA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYVFphYmNkZWZnaGlrbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OVwiO1xyXG4gICAgdmFyIHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmdMZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnMubGVuZ3RoKTtcclxuICAgICAgc3RyaW5nICs9IGNoYXJzLnN1YnN0cmluZyhyYW5kb21OdW1iZXIsIHJhbmRvbU51bWJlciArIDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdHJpbmc7XHJcbiAgfVxyXG5cclxuICBnZXRUaW1lc3RhbXAoY2FsbGJhY2spIHtcclxuICAgIHZhciBmaXJlYmFzZUFwcCA9IHRoaXMuZmlyZWJhc2VBcHA7XHJcbiAgICB2YXIgcmVmID0gZmlyZWJhc2VBcHBcclxuICAgICAgLmRhdGFiYXNlKClcclxuICAgICAgLnJlZih0aGlzLmdldFRpbWVzdGFtcEdlbmVyYXRpb25QYXRoKHRoaXMubG9jYWxJZCkpO1xyXG4gICAgcmVmLnNldCh0aGlzLmZpcmViYXNlLmRhdGFiYXNlLlNlcnZlclZhbHVlLlRJTUVTVEFNUCk7XHJcbiAgICByZWYub25jZShcInZhbHVlXCIsIGZ1bmN0aW9uKGRhdGEpIHtcclxuICAgICAgdmFyIHRpbWVzdGFtcCA9IGRhdGEudmFsKCk7XHJcbiAgICAgIHJlZi5yZW1vdmUoKTtcclxuICAgICAgY2FsbGJhY2sodGltZXN0YW1wKTtcclxuICAgIH0pO1xyXG4gICAgcmVmLm9uRGlzY29ubmVjdCgpLnJlbW92ZSgpO1xyXG4gIH1cclxufVxyXG5cclxuTkFGLmFkYXB0ZXJzLnJlZ2lzdGVyKFwiZmlyZWJhc2VcIiwgRmlyZWJhc2VXZWJSdGNBZGFwdGVyKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gRmlyZWJhc2VXZWJSdGNBZGFwdGVyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvaW5kZXguanMiLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGVuY29kZTogZnVuY3Rpb24gKGRlY29kZWQpIHtcclxuICAgICAgICByZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGRlY29kZWQpLnJlcGxhY2UoL1xcLi9nLCAnJTJFJyk7XHJcbiAgICB9LFxyXG4gICAgZGVjb2RlOiBmdW5jdGlvbiAoZW5jb2RlZCkge1xyXG4gICAgICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoZW5jb2RlZC5yZXBsYWNlKCclMkUnLCAnLicpKTtcclxuICAgIH0sXHJcbiAgICAvLyBSZXBsYWNlcyB0aGUga2V5IHdpdGggYGZuKGtleSlgIG9uIGVhY2gga2V5IGluIGFuIG9iamVjdCB0cmVlLlxyXG4gICAgLy8gaS5lLiBtYWtpbmcgYWxsIGtleXMgdXBwZXJjYXNlLlxyXG4gICAgZGVlcEtleVJlcGxhY2U6IGZ1bmN0aW9uIChvYmosIGZuKSB7XHJcbiAgICAgICAgdmFyIHJlYnVpbHRUcmVlID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdHJhdmVyc2UobywgeCwgZnVuYykge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mKG8pID09PSBcIm9iamVjdFwiKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpIGluIG8pIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob1tpXSAhPT0gbnVsbCAmJiAodHlwZW9mKG9baV0pPT1cIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkob1tpXSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZ29pbmcgb24gc3RlcCBkb3duIGluIHRoZSBvYmplY3QgdHJlZSEhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlcnNlKG9baV0seFtpXSxmdW5jKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZnVuYy5hcHBseSh0aGlzLFt4LCBpLCB4W2ldXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShvKSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuYy5hcHBseSh0aGlzLFtvLCBpLG9baV1dKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAob1tpXSAhPT0gbnVsbCAmJiAodHlwZW9mKG9baV0pPT1cIm9iamVjdFwiIHx8IEFycmF5LmlzQXJyYXkob1tpXSkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZ29pbmcgb24gc3RlcCBkb3duIGluIHRoZSBvYmplY3QgdHJlZSEhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYXZlcnNlKG9baV0sIHhbaV0sIGZ1bmMpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdHJhdmVyc2Uob2JqLCByZWJ1aWx0VHJlZSwgZnVuY3Rpb24gKHBhcmVudCwga2V5LCB2YWwpIHtcclxuICAgICAgICAgICAgZGVsZXRlIHBhcmVudFtrZXldO1xyXG4gICAgICAgICAgICBwYXJlbnRbZm4oa2V5KV0gPSB2YWw7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiByZWJ1aWx0VHJlZTtcclxuICAgIH0sXHJcbiAgICBkZWVwRGVjb2RlOiBmdW5jdGlvbiAoZW5jb2RlZFRyZWUpIHtcclxuICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgcmVidWlsdFRyZWUgPSB0aGlzLmRlZXBLZXlSZXBsYWNlKGVuY29kZWRUcmVlLCBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkdGhpcy5kZWNvZGUoa2V5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlYnVpbHRUcmVlO1xyXG4gICAgfSxcclxuICAgIGRlZXBFbmNvZGU6IGZ1bmN0aW9uIChkZWNvZGVkVHJlZSkge1xyXG4gICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciByZWJ1aWx0VHJlZSA9IHRoaXMuZGVlcEtleVJlcGxhY2UoZGVjb2RlZFRyZWUsIGZ1bmN0aW9uIChrZXkpIHtcclxuICAgICAgICAgICAgcmV0dXJuICR0aGlzLmVuY29kZShrZXkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVidWlsdFRyZWU7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZmlyZWJhc2Uta2V5LWVuY29kZS9maXJlYmFzZS1rZXktZW5jb2RlLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNsYXNzIFdlYlJ0Y1BlZXIge1xyXG4gIGNvbnN0cnVjdG9yKGxvY2FsSWQsIHJlbW90ZUlkLCBzZW5kU2lnbmFsRnVuYykge1xyXG4gICAgdGhpcy5sb2NhbElkID0gbG9jYWxJZDtcclxuICAgIHRoaXMucmVtb3RlSWQgPSByZW1vdGVJZDtcclxuICAgIHRoaXMuc2VuZFNpZ25hbEZ1bmMgPSBzZW5kU2lnbmFsRnVuYztcclxuICAgIHRoaXMub3BlbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5jaGFubmVsTGFiZWwgPSBcIm5ldHdvcmtlZC1hZnJhbWUtY2hhbm5lbFwiO1xyXG5cclxuICAgIHRoaXMucGMgPSB0aGlzLmNyZWF0ZVBlZXJDb25uZWN0aW9uKCk7XHJcbiAgICB0aGlzLmNoYW5uZWwgPSBudWxsO1xyXG4gIH1cclxuXHJcbiAgc2V0RGF0YWNoYW5uZWxMaXN0ZW5lcnMob3Blbkxpc3RlbmVyLCBjbG9zZWRMaXN0ZW5lciwgbWVzc2FnZUxpc3RlbmVyKSB7XHJcbiAgICB0aGlzLm9wZW5MaXN0ZW5lciA9IG9wZW5MaXN0ZW5lcjtcclxuICAgIHRoaXMuY2xvc2VkTGlzdGVuZXIgPSBjbG9zZWRMaXN0ZW5lcjtcclxuICAgIHRoaXMubWVzc2FnZUxpc3RlbmVyID0gbWVzc2FnZUxpc3RlbmVyO1xyXG4gIH1cclxuXHJcbiAgb2ZmZXIoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAvLyByZWxpYWJsZTogZmFsc2UgLSBVRFBcclxuICAgIHRoaXMuc2V0dXBDaGFubmVsKFxyXG4gICAgICB0aGlzLnBjLmNyZWF0ZURhdGFDaGFubmVsKHRoaXMuY2hhbm5lbExhYmVsLCB7IHJlbGlhYmxlOiBmYWxzZSB9KVxyXG4gICAgKTtcclxuICAgIHRoaXMucGMuY3JlYXRlT2ZmZXIoXHJcbiAgICAgIGZ1bmN0aW9uKHNkcCkge1xyXG4gICAgICAgIHNlbGYuaGFuZGxlU2Vzc2lvbkRlc2NyaXB0aW9uKHNkcCk7XHJcbiAgICAgIH0sXHJcbiAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIldlYlJ0Y1BlZXIub2ZmZXI6IFwiICsgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaGFuZGxlU2lnbmFsKHNpZ25hbCkge1xyXG4gICAgLy8gaWdub3JlcyBzaWduYWwgaWYgaXQgaXNuJ3QgZm9yIG1lXHJcbiAgICBpZiAodGhpcy5sb2NhbElkICE9PSBzaWduYWwudG8gfHwgdGhpcy5yZW1vdGVJZCAhPT0gc2lnbmFsLmZyb20pIHJldHVybjtcclxuXHJcbiAgICBzd2l0Y2ggKHNpZ25hbC50eXBlKSB7XHJcbiAgICAgIGNhc2UgXCJvZmZlclwiOlxyXG4gICAgICAgIHRoaXMuaGFuZGxlT2ZmZXIoc2lnbmFsKTtcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgXCJhbnN3ZXJcIjpcclxuICAgICAgICB0aGlzLmhhbmRsZUFuc3dlcihzaWduYWwpO1xyXG4gICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgY2FzZSBcImNhbmRpZGF0ZVwiOlxyXG4gICAgICAgIHRoaXMuaGFuZGxlQ2FuZGlkYXRlKHNpZ25hbCk7XHJcbiAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICBcIldlYlJ0Y1BlZXIuaGFuZGxlU2lnbmFsOiBVbmtub3duIHNpZ25hbCB0eXBlIFwiICsgc2lnbmFsLnR5cGVcclxuICAgICAgICApO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2VuZCh0eXBlLCBkYXRhKSB7XHJcbiAgICAvLyBUT0RPOiB0aHJvdyBlcnJvcj9cclxuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IG51bGwgfHwgdGhpcy5jaGFubmVsLnJlYWR5U3RhdGUgIT09IFwib3BlblwiKSByZXR1cm47XHJcblxyXG4gICAgdGhpcy5jaGFubmVsLnNlbmQoSlNPTi5zdHJpbmdpZnkoeyB0eXBlOiB0eXBlLCBkYXRhOiBkYXRhIH0pKTtcclxuICB9XHJcblxyXG4gIGdldFN0YXR1cygpIHtcclxuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IG51bGwpIHJldHVybiBXZWJSdGNQZWVyLk5PVF9DT05ORUNURUQ7XHJcblxyXG4gICAgc3dpdGNoICh0aGlzLmNoYW5uZWwucmVhZHlTdGF0ZSkge1xyXG4gICAgICBjYXNlIFwib3BlblwiOlxyXG4gICAgICAgIHJldHVybiBXZWJSdGNQZWVyLklTX0NPTk5FQ1RFRDtcclxuXHJcbiAgICAgIGNhc2UgXCJjb25uZWN0aW5nXCI6XHJcbiAgICAgICAgcmV0dXJuIFdlYlJ0Y1BlZXIuQ09OTkVDVElORztcclxuXHJcbiAgICAgIGNhc2UgXCJjbG9zaW5nXCI6XHJcbiAgICAgIGNhc2UgXCJjbG9zZWRcIjpcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICByZXR1cm4gV2ViUnRjUGVlci5OT1RfQ09OTkVDVEVEO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypcclxuICAgICAqIFByaXZhdGVzXHJcbiAgICAgKi9cclxuXHJcbiAgY3JlYXRlUGVlckNvbm5lY3Rpb24oKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgUlRDUGVlckNvbm5lY3Rpb24gPVxyXG4gICAgICB3aW5kb3cuUlRDUGVlckNvbm5lY3Rpb24gfHxcclxuICAgICAgd2luZG93LndlYmtpdFJUQ1BlZXJDb25uZWN0aW9uIHx8XHJcbiAgICAgIHdpbmRvdy5tb3pSVENQZWVyQ29ubmVjdGlvbiB8fFxyXG4gICAgICB3aW5kb3cubXNSVENQZWVyQ29ubmVjdGlvbjtcclxuXHJcbiAgICBpZiAoUlRDUGVlckNvbm5lY3Rpb24gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXHJcbiAgICAgICAgXCJXZWJSdGNQZWVyLmNyZWF0ZVBlZXJDb25uZWN0aW9uOiBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc2VlbSB0byBzdXBwb3J0IFdlYlJUQy5cIlxyXG4gICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBwYyA9IG5ldyBSVENQZWVyQ29ubmVjdGlvbih7IGljZVNlcnZlcnM6IFdlYlJ0Y1BlZXIuSUNFX1NFUlZFUlMgfSk7XHJcblxyXG4gICAgcGMub25pY2VjYW5kaWRhdGUgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBpZiAoZXZlbnQuY2FuZGlkYXRlKSB7XHJcbiAgICAgICAgc2VsZi5zZW5kU2lnbmFsRnVuYyh7XHJcbiAgICAgICAgICBmcm9tOiBzZWxmLmxvY2FsSWQsXHJcbiAgICAgICAgICB0bzogc2VsZi5yZW1vdGVJZCxcclxuICAgICAgICAgIHR5cGU6IFwiY2FuZGlkYXRlXCIsXHJcbiAgICAgICAgICBzZHBNTGluZUluZGV4OiBldmVudC5jYW5kaWRhdGUuc2RwTUxpbmVJbmRleCxcclxuICAgICAgICAgIGNhbmRpZGF0ZTogZXZlbnQuY2FuZGlkYXRlLmNhbmRpZGF0ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIE5vdGU6IHNlZW1zIGxpa2UgY2hhbm5lbC5vbmNsb3NlIGhhbmRlciBpcyB1bnJlbGlhYmxlIG9uIHNvbWUgcGxhdGZvcm1zLFxyXG4gICAgLy8gICAgICAgc28gYWxzbyB0cmllcyB0byBkZXRlY3QgZGlzY29ubmVjdGlvbiBoZXJlLlxyXG4gICAgcGMub25pY2Vjb25uZWN0aW9uc3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuICAgICAgaWYgKHNlbGYub3BlbiAmJiBwYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09IFwiZGlzY29ubmVjdGVkXCIpIHtcclxuICAgICAgICBzZWxmLm9wZW4gPSBmYWxzZTtcclxuICAgICAgICBzZWxmLmNsb3NlZExpc3RlbmVyKHNlbGYucmVtb3RlSWQpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBwYztcclxuICB9XHJcblxyXG4gIHNldHVwQ2hhbm5lbChjaGFubmVsKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcclxuXHJcbiAgICAvLyByZWNlaXZlZCBkYXRhIGZyb20gYSByZW1vdGUgcGVlclxyXG4gICAgdGhpcy5jaGFubmVsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhKTtcclxuICAgICAgc2VsZi5tZXNzYWdlTGlzdGVuZXIoc2VsZi5yZW1vdGVJZCwgZGF0YS50eXBlLCBkYXRhLmRhdGEpO1xyXG4gICAgfTtcclxuXHJcbiAgICAvLyBjb25uZWN0ZWQgd2l0aCBhIHJlbW90ZSBwZWVyXHJcbiAgICB0aGlzLmNoYW5uZWwub25vcGVuID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgc2VsZi5vcGVuID0gdHJ1ZTtcclxuICAgICAgc2VsZi5vcGVuTGlzdGVuZXIoc2VsZi5yZW1vdGVJZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGRpc2Nvbm5lY3RlZCB3aXRoIGEgcmVtb3RlIHBlZXJcclxuICAgIHRoaXMuY2hhbm5lbC5vbmNsb3NlID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgaWYgKCFzZWxmLm9wZW4pIHJldHVybjtcclxuICAgICAgc2VsZi5vcGVuID0gZmFsc2U7XHJcbiAgICAgIHNlbGYuY2xvc2VkTGlzdGVuZXIoc2VsZi5yZW1vdGVJZCk7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIGVycm9yIG9jY3VycmVkIHdpdGggYSByZW1vdGUgcGVlclxyXG4gICAgdGhpcy5jaGFubmVsLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiV2ViUnRjUGVlci5jaGFubmVsLm9uZXJyb3I6IFwiICsgZXJyb3IpO1xyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIGhhbmRsZU9mZmVyKG1lc3NhZ2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLnBjLm9uZGF0YWNoYW5uZWwgPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBzZWxmLnNldHVwQ2hhbm5lbChldmVudC5jaGFubmVsKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXRSZW1vdGVEZXNjcmlwdGlvbihtZXNzYWdlKTtcclxuXHJcbiAgICB0aGlzLnBjLmNyZWF0ZUFuc3dlcihcclxuICAgICAgZnVuY3Rpb24oc2RwKSB7XHJcbiAgICAgICAgc2VsZi5oYW5kbGVTZXNzaW9uRGVzY3JpcHRpb24oc2RwKTtcclxuICAgICAgfSxcclxuICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiV2ViUnRjUGVlci5oYW5kbGVPZmZlcjogXCIgKyBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBoYW5kbGVBbnN3ZXIobWVzc2FnZSkge1xyXG4gICAgdGhpcy5zZXRSZW1vdGVEZXNjcmlwdGlvbihtZXNzYWdlKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNhbmRpZGF0ZShtZXNzYWdlKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICB2YXIgUlRDSWNlQ2FuZGlkYXRlID1cclxuICAgICAgd2luZG93LlJUQ0ljZUNhbmRpZGF0ZSB8fFxyXG4gICAgICB3aW5kb3cud2Via2l0UlRDSWNlQ2FuZGlkYXRlIHx8XHJcbiAgICAgIHdpbmRvdy5tb3pSVENJY2VDYW5kaWRhdGU7XHJcblxyXG4gICAgdGhpcy5wYy5hZGRJY2VDYW5kaWRhdGUoXHJcbiAgICAgIG5ldyBSVENJY2VDYW5kaWRhdGUobWVzc2FnZSksXHJcbiAgICAgIGZ1bmN0aW9uKCkge30sXHJcbiAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcihcIldlYlJ0Y1BlZXIuaGFuZGxlQ2FuZGlkYXRlOiBcIiArIGVycm9yKTtcclxuICAgICAgfVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZVNlc3Npb25EZXNjcmlwdGlvbihzZHApIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICB0aGlzLnBjLnNldExvY2FsRGVzY3JpcHRpb24oXHJcbiAgICAgIHNkcCxcclxuICAgICAgZnVuY3Rpb24oKSB7fSxcclxuICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiV2ViUnRjUGVlci5oYW5kbGVTZXNzaW9uRGVzY3JpcHRpb246IFwiICsgZXJyb3IpO1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuc2VuZFNpZ25hbEZ1bmMoe1xyXG4gICAgICBmcm9tOiB0aGlzLmxvY2FsSWQsXHJcbiAgICAgIHRvOiB0aGlzLnJlbW90ZUlkLFxyXG4gICAgICB0eXBlOiBzZHAudHlwZSxcclxuICAgICAgc2RwOiBzZHAuc2RwXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHNldFJlbW90ZURlc2NyaXB0aW9uKG1lc3NhZ2UpIHtcclxuICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgIHZhciBSVENTZXNzaW9uRGVzY3JpcHRpb24gPVxyXG4gICAgICB3aW5kb3cuUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIHx8XHJcbiAgICAgIHdpbmRvdy53ZWJraXRSVENTZXNzaW9uRGVzY3JpcHRpb24gfHxcclxuICAgICAgd2luZG93Lm1velJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxyXG4gICAgICB3aW5kb3cubXNSVENTZXNzaW9uRGVzY3JpcHRpb247XHJcblxyXG4gICAgdGhpcy5wYy5zZXRSZW1vdGVEZXNjcmlwdGlvbihcclxuICAgICAgbmV3IFJUQ1Nlc3Npb25EZXNjcmlwdGlvbihtZXNzYWdlKSxcclxuICAgICAgZnVuY3Rpb24oKSB7fSxcclxuICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiV2ViUnRjUGVlci5zZXRSZW1vdGVEZXNjcmlwdGlvbjogXCIgKyBlcnJvcik7XHJcbiAgICAgIH1cclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5XZWJSdGNQZWVyLklTX0NPTk5FQ1RFRCA9IFwiSVNfQ09OTkVDVEVEXCI7XHJcbldlYlJ0Y1BlZXIuQ09OTkVDVElORyA9IFwiQ09OTkVDVElOR1wiO1xyXG5XZWJSdGNQZWVyLk5PVF9DT05ORUNURUQgPSBcIk5PVF9DT05ORUNURURcIjtcclxuXHJcbldlYlJ0Y1BlZXIuSUNFX1NFUlZFUlMgPSBbXHJcbiAgeyB1cmxzOiBcInN0dW46c3R1bjEubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcclxuICB7IHVybHM6IFwic3R1bjpzdHVuMi5sLmdvb2dsZS5jb206MTkzMDJcIiB9LFxyXG4gIHsgdXJsczogXCJzdHVuOnN0dW4zLmwuZ29vZ2xlLmNvbToxOTMwMlwiIH0sXHJcbiAgeyB1cmxzOiBcInN0dW46c3R1bjQubC5nb29nbGUuY29tOjE5MzAyXCIgfVxyXG5dO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBXZWJSdGNQZWVyO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvV2ViUnRjUGVlci5qcyJdLCJzb3VyY2VSb290IjoiIn0=