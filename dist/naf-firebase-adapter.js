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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/firebase-key-encode/firebase-key-encode.js":
/*!*****************************************************************!*\
  !*** ./node_modules/firebase-key-encode/firebase-key-encode.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

module.exports = {
  encode: function encode(decoded) {
    return encodeURIComponent(decoded).replace(/\./g, '%2E');
  },
  decode: function decode(encoded) {
    return decodeURIComponent(encoded.replace('%2E', '.'));
  },
  // Replaces the key with `fn(key)` on each key in an object tree.
  // i.e. making all keys uppercase.
  deepKeyReplace: function deepKeyReplace(obj, fn) {
    var rebuiltTree = Object.assign({}, obj);

    function traverse(o, x, func) {
      if (_typeof(o) === "object") {
        for (var i in o) {
          if (o[i] !== null && (_typeof(o[i]) == "object" || Array.isArray(o[i]))) {
            //going on step down in the object tree!!
            traverse(o[i], x[i], func);
          }

          func.apply(this, [x, i, x[i]]);
        }
      } else if (Array.isArray(o)) {
        for (var i = 0; i < o.length; i++) {
          // func.apply(this,[o, i,o[i]]);
          if (o[i] !== null && (_typeof(o[i]) == "object" || Array.isArray(o[i]))) {
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
  deepDecode: function deepDecode(encodedTree) {
    var $this = this;
    var rebuiltTree = this.deepKeyReplace(encodedTree, function (key) {
      return $this.decode(key);
    });
    return rebuiltTree;
  },
  deepEncode: function deepEncode(decodedTree) {
    var $this = this;
    var rebuiltTree = this.deepKeyReplace(decodedTree, function (key) {
      return $this.encode(key);
    });
    return rebuiltTree;
  }
};

/***/ }),

/***/ "./src/WebRtcPeer.js":
/*!***************************!*\
  !*** ./src/WebRtcPeer.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var WebRtcPeer = /*#__PURE__*/function () {
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
      var self = this; // reliable: false - UDP

      this.setupChannel(this.pc.createDataChannel(this.channelLabel, {
        reliable: false
      }));
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
      this.channel.send(JSON.stringify({
        type: type,
        data: data
      }));
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

      var pc = new RTCPeerConnection({
        iceServers: WebRtcPeer.ICE_SERVERS
      });

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
      }; // Note: seems like channel.onclose hander is unreliable on some platforms,
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
      this.channel = channel; // received data from a remote peer

      this.channel.onmessage = function (event) {
        var data = JSON.parse(event.data);
        self.messageListener(self.remoteId, data.type, data.data);
      }; // connected with a remote peer


      this.channel.onopen = function (event) {
        self.open = true;
        self.openListener(self.remoteId);
      }; // disconnected with a remote peer


      this.channel.onclose = function (event) {
        if (!self.open) return;
        self.open = false;
        self.closedListener(self.remoteId);
      }; // error occurred with a remote peer


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
WebRtcPeer.ICE_SERVERS = [{
  urls: "stun:stun1.l.google.com:19302"
}, {
  urls: "stun:stun2.l.google.com:19302"
}, {
  urls: "stun:stun3.l.google.com:19302"
}, {
  urls: "stun:stun4.l.google.com:19302"
}];
module.exports = WebRtcPeer;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var firebaseKeyEncode = __webpack_require__(/*! firebase-key-encode */ "./node_modules/firebase-key-encode/firebase-key-encode.js");

var WebRtcPeer = __webpack_require__(/*! ./WebRtcPeer */ "./src/WebRtcPeer.js");

var FirebaseWebRtcAdapter = /*#__PURE__*/function () {
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

    this.serverTimeRequests = 0;
    this.timeOffsets = [];
    this.avgTimeOffset = 0;
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
    value: function setServerUrl(url) {// handled in config
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
    } // options: { datachannel: bool, audio: bool }

  }, {
    key: "setWebRtcOptions",
    value: function setWebRtcOptions(options) {
      // TODO: support audio and video
      if (options.datachannel === false) NAF.log.warn("FirebaseWebRtcAdapter.setWebRtcOptions: datachannel must be true.");
      if (options.audio === true) NAF.log.warn("FirebaseWebRtcAdapter does not support audio yet.");
      if (options.video === true) NAF.log.warn("FirebaseWebRtcAdapter does not support video yet.");
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
        self.updateTimeOffset();
        self.localId = id;
        var firebaseApp = self.firebaseApp; // Note: assuming that data transfer via firebase realtime database
        //       is reliable and in order
        // TODO: can race among peers? If so, fix

        self.getTimestamp(function (timestamp) {
          self.myRoomJoinTime = timestamp;
          var userRef = firebaseApp.database().ref(self.getUserPath(self.localId));
          userRef.set({
            timestamp: timestamp,
            signal: "",
            data: ""
          });
          userRef.onDisconnect().remove();
          var roomRef = firebaseApp.database().ref(self.getRoomPath());
          roomRef.on("child_added", function (data) {
            var remoteId = data.key;
            if (remoteId === self.localId || remoteId === "timestamp" || self.peers[remoteId] !== undefined) return;
            var remoteTimestamp = data.val().timestamp;
            var peer = new WebRtcPeer(self.localId, remoteId, // send signal function
            function (data) {
              firebaseApp.database().ref(self.getSignalPath(self.localId)).set(data);
            });
            peer.setDatachannelListeners(self.openListener, self.closedListener, self.messageListener);
            self.peers[remoteId] = peer;
            self.occupants[remoteId] = remoteTimestamp; // received signal

            firebaseApp.database().ref(self.getSignalPath(remoteId)).on("value", function (data) {
              var value = data.val();
              if (value === null || value === "") return;
              peer.handleSignal(value);
            }); // received data

            firebaseApp.database().ref(self.getDataPath(remoteId)).on("value", function (data) {
              var value = data.val();
              if (value === null || value === "" || value.to !== self.localId) return;
              self.messageListener(remoteId, value.type, value.data);
            }); // send offer from a peer who
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
    value: function startStreamConnection(clientId) {// Handled by WebRtcPeer
    }
  }, {
    key: "closeStreamConnection",
    value: function closeStreamConnection(clientId) {// Handled by WebRtcPeer
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
  }, {
    key: "getMediaStream",
    value: function getMediaStream(clientId) {
      return Promise.reject("Interface method not implemented: getMediaStream");
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
          NAF.log.log("FirebaseWebRtcInterface.auth: Unknown authType " + type);
          break;
      }
    }
  }, {
    key: "authNone",
    value: function authNone(callback) {
      var self = this; // asynchronously invokes open listeners for the compatibility with other auth types.
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
      firebaseApp.auth().signInAnonymously()["catch"](function (error) {
        NAF.log.error("FirebaseWebRtcInterface.authAnonymous: " + error);
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
  }, {
    key: "updateTimeOffset",
    value: function updateTimeOffset() {
      var _this = this;

      return this.firebaseApp.database().ref("/.info/serverTimeOffset").once("value").then(function (data) {
        var timeOffset = data.val();
        _this.serverTimeRequests++;

        if (_this.serverTimeRequests <= 10) {
          _this.timeOffsets.push(timeOffset);
        } else {
          _this.timeOffsets[_this.serverTimeRequests % 10] = timeOffset;
        }

        _this.avgTimeOffset = _this.timeOffsets.reduce(function (acc, offset) {
          return acc += offset;
        }, 0) / _this.timeOffsets.length;

        if (_this.serverTimeRequests > 10) {
          setTimeout(function () {
            return _this.updateTimeOffset();
          }, 5 * 60 * 1000); // Sync clock every 5 minutes.
        } else {
          _this.updateTimeOffset();
        }
      });
    }
  }, {
    key: "getServerTime",
    value: function getServerTime() {
      return new Date() + this.avgTimeOffset;
    }
  }]);

  return FirebaseWebRtcAdapter;
}();

NAF.adapters.register("firebase", FirebaseWebRtcAdapter);
module.exports = FirebaseWebRtcAdapter;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZpcmViYXNlLWtleS1lbmNvZGUvZmlyZWJhc2Uta2V5LWVuY29kZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvV2ViUnRjUGVlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsImVuY29kZSIsImRlY29kZWQiLCJlbmNvZGVVUklDb21wb25lbnQiLCJyZXBsYWNlIiwiZGVjb2RlIiwiZW5jb2RlZCIsImRlY29kZVVSSUNvbXBvbmVudCIsImRlZXBLZXlSZXBsYWNlIiwib2JqIiwiZm4iLCJyZWJ1aWx0VHJlZSIsIk9iamVjdCIsImFzc2lnbiIsInRyYXZlcnNlIiwibyIsIngiLCJmdW5jIiwiaSIsIkFycmF5IiwiaXNBcnJheSIsImFwcGx5IiwibGVuZ3RoIiwicGFyZW50Iiwia2V5IiwidmFsIiwiZGVlcERlY29kZSIsImVuY29kZWRUcmVlIiwiJHRoaXMiLCJkZWVwRW5jb2RlIiwiZGVjb2RlZFRyZWUiLCJXZWJSdGNQZWVyIiwibG9jYWxJZCIsInJlbW90ZUlkIiwic2VuZFNpZ25hbEZ1bmMiLCJvcGVuIiwiY2hhbm5lbExhYmVsIiwicGMiLCJjcmVhdGVQZWVyQ29ubmVjdGlvbiIsImNoYW5uZWwiLCJvcGVuTGlzdGVuZXIiLCJjbG9zZWRMaXN0ZW5lciIsIm1lc3NhZ2VMaXN0ZW5lciIsInNlbGYiLCJzZXR1cENoYW5uZWwiLCJjcmVhdGVEYXRhQ2hhbm5lbCIsInJlbGlhYmxlIiwiY3JlYXRlT2ZmZXIiLCJzZHAiLCJoYW5kbGVTZXNzaW9uRGVzY3JpcHRpb24iLCJlcnJvciIsImNvbnNvbGUiLCJzaWduYWwiLCJ0byIsImZyb20iLCJ0eXBlIiwiaGFuZGxlT2ZmZXIiLCJoYW5kbGVBbnN3ZXIiLCJoYW5kbGVDYW5kaWRhdGUiLCJkYXRhIiwicmVhZHlTdGF0ZSIsInNlbmQiLCJKU09OIiwic3RyaW5naWZ5IiwiTk9UX0NPTk5FQ1RFRCIsIklTX0NPTk5FQ1RFRCIsIkNPTk5FQ1RJTkciLCJSVENQZWVyQ29ubmVjdGlvbiIsIndpbmRvdyIsIndlYmtpdFJUQ1BlZXJDb25uZWN0aW9uIiwibW96UlRDUGVlckNvbm5lY3Rpb24iLCJtc1JUQ1BlZXJDb25uZWN0aW9uIiwidW5kZWZpbmVkIiwiRXJyb3IiLCJpY2VTZXJ2ZXJzIiwiSUNFX1NFUlZFUlMiLCJvbmljZWNhbmRpZGF0ZSIsImV2ZW50IiwiY2FuZGlkYXRlIiwic2RwTUxpbmVJbmRleCIsIm9uaWNlY29ubmVjdGlvbnN0YXRlY2hhbmdlIiwiaWNlQ29ubmVjdGlvblN0YXRlIiwib25tZXNzYWdlIiwicGFyc2UiLCJvbm9wZW4iLCJvbmNsb3NlIiwib25lcnJvciIsIm1lc3NhZ2UiLCJvbmRhdGFjaGFubmVsIiwic2V0UmVtb3RlRGVzY3JpcHRpb24iLCJjcmVhdGVBbnN3ZXIiLCJSVENJY2VDYW5kaWRhdGUiLCJ3ZWJraXRSVENJY2VDYW5kaWRhdGUiLCJtb3pSVENJY2VDYW5kaWRhdGUiLCJhZGRJY2VDYW5kaWRhdGUiLCJzZXRMb2NhbERlc2NyaXB0aW9uIiwiUlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwid2Via2l0UlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwibW96UlRDU2Vzc2lvbkRlc2NyaXB0aW9uIiwibXNSVENTZXNzaW9uRGVzY3JpcHRpb24iLCJ1cmxzIiwiZmlyZWJhc2VLZXlFbmNvZGUiLCJyZXF1aXJlIiwiRmlyZWJhc2VXZWJSdGNBZGFwdGVyIiwiZmlyZWJhc2UiLCJjb25maWciLCJyb290UGF0aCIsImFwcElkIiwicm9vbUlkIiwicGVlcnMiLCJvY2N1cGFudHMiLCJzZXJ2ZXJUaW1lUmVxdWVzdHMiLCJ0aW1lT2Zmc2V0cyIsImF2Z1RpbWVPZmZzZXQiLCJmaXJlYmFzZUNvbmZpZyIsImF1dGhUeXBlIiwiYXBpS2V5IiwiYXV0aERvbWFpbiIsImRhdGFiYXNlVVJMIiwidXJsIiwib3B0aW9ucyIsImRhdGFjaGFubmVsIiwiTkFGIiwibG9nIiwid2FybiIsImF1ZGlvIiwidmlkZW8iLCJzdWNjZXNzTGlzdGVuZXIiLCJmYWlsdXJlTGlzdGVuZXIiLCJjb25uZWN0U3VjY2VzcyIsImNvbm5lY3RGYWlsdXJlIiwib2NjdXBhbnRMaXN0ZW5lciIsImRhdGFUeXBlIiwiZGVjb2RlZERhdGEiLCJpbml0RmlyZWJhc2UiLCJpZCIsInVwZGF0ZVRpbWVPZmZzZXQiLCJmaXJlYmFzZUFwcCIsImdldFRpbWVzdGFtcCIsInRpbWVzdGFtcCIsIm15Um9vbUpvaW5UaW1lIiwidXNlclJlZiIsImRhdGFiYXNlIiwicmVmIiwiZ2V0VXNlclBhdGgiLCJzZXQiLCJvbkRpc2Nvbm5lY3QiLCJyZW1vdmUiLCJyb29tUmVmIiwiZ2V0Um9vbVBhdGgiLCJvbiIsInJlbW90ZVRpbWVzdGFtcCIsInBlZXIiLCJnZXRTaWduYWxQYXRoIiwic2V0RGF0YWNoYW5uZWxMaXN0ZW5lcnMiLCJ2YWx1ZSIsImhhbmRsZVNpZ25hbCIsImdldERhdGFQYXRoIiwib2ZmZXIiLCJjbGllbnQiLCJyb29tSm9pblRpbWUiLCJjbGllbnRJZCIsImNsb25lZERhdGEiLCJlbmNvZGVkRGF0YSIsImhhc093blByb3BlcnR5Iiwic2VuZERhdGEiLCJzZW5kRGF0YUd1YXJhbnRlZWQiLCJhZGFwdGVycyIsImdldFN0YXR1cyIsIlByb21pc2UiLCJyZWplY3QiLCJjYWxsYmFjayIsImluaXRpYWxpemVBcHAiLCJhdXRoIiwiYXV0aE5vbmUiLCJhdXRoQW5vbnltb3VzIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwicmFuZG9tU3RyaW5nIiwic2lnbkluQW5vbnltb3VzbHkiLCJvbkF1dGhTdGF0ZUNoYW5nZWQiLCJ1c2VyIiwidWlkIiwiZ2V0Um9vdFBhdGgiLCJnZXRBcHBQYXRoIiwic3RyaW5nTGVuZ3RoIiwiY2hhcnMiLCJzdHJpbmciLCJyYW5kb21OdW1iZXIiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJzdWJzdHJpbmciLCJnZXRUaW1lc3RhbXBHZW5lcmF0aW9uUGF0aCIsIlNlcnZlclZhbHVlIiwiVElNRVNUQU1QIiwib25jZSIsInRoZW4iLCJ0aW1lT2Zmc2V0IiwicHVzaCIsInJlZHVjZSIsImFjYyIsIm9mZnNldCIsInNldFRpbWVvdXQiLCJEYXRlIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7O0FDbEZBQSxNQUFNLENBQUNDLE9BQVAsR0FBaUI7QUFDYkMsUUFBTSxFQUFFLGdCQUFVQyxPQUFWLEVBQW1CO0FBQ3ZCLFdBQU9DLGtCQUFrQixDQUFDRCxPQUFELENBQWxCLENBQTRCRSxPQUE1QixDQUFvQyxLQUFwQyxFQUEyQyxLQUEzQyxDQUFQO0FBQ0gsR0FIWTtBQUliQyxRQUFNLEVBQUUsZ0JBQVVDLE9BQVYsRUFBbUI7QUFDdkIsV0FBT0Msa0JBQWtCLENBQUNELE9BQU8sQ0FBQ0YsT0FBUixDQUFnQixLQUFoQixFQUF1QixHQUF2QixDQUFELENBQXpCO0FBQ0gsR0FOWTtB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TUFBekI7QUFBQSxTQUF4QixFQUEwRCxDQUExRCxJQUNBLEtBQUksQ0FBQ3pGLFdBQUwsQ0FBaUIxRixNQUZuQjs7QUFJQSxZQUFJLEtBQUksQ0FBQ3lGLGtCQUFMLEdBQTBCLEVBQTlCLEVBQWtDO0FBQ2hDMkYsb0JBQVUsQ0FBQztBQUFBLG1CQUFNLEtBQUksQ0FBQ2xFLGdCQUFMLEVBQU47QUFBQSxXQUFELEVBQWdDLElBQUksRUFBSixHQUFTLElBQXpDLENBQVYsQ0FEZ0MsQ0FDMEI7QUFDM0QsU0FGRCxNQUVPO0FBQ0wsZUFBSSxDQUFDQSxnQkFBTDtBQUNEO0FBQ0YsT0F4QkksQ0FBUDtBQXlCRDs7O29DQUVlO0FBQ2QsYUFBTyxJQUFJbUUsSUFBSixLQUFhLEtBQUsxRixhQUF6QjtBQUNEOzs7Ozs7QUFHSFMsR0FBRyxDQUFDNkMsUUFBSixDQUFhcUMsUUFBYixDQUFzQixVQUF0QixFQUFrQ3JHLHFCQUFsQztBQUVBeEcsTUFBTSxDQUFDQyxPQUFQLEdBQWlCdUcscUJBQWpCLEMiLCJmaWxlIjoibmFmLWZpcmViYXNlLWFkYXB0ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGVuY29kZTogZnVuY3Rpb24gKGRlY29kZWQpIHtcbiAgICAgICAgcmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChkZWNvZGVkKS5yZXBsYWNlKC9cXC4vZywgJyUyRScpO1xuICAgIH0sXG4gICAgZGVjb2RlOiBmdW5jdGlvbiAoZW5jb2RlZCkge1xuICAgICAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGVuY29kZWQucmVwbGFjZSgnJTJFJywgJy4nKSk7XG4gICAgfSxcbiAgICAvLyBSZXBsYWNlcyB0aGUga2V5IHdpdGggYGZuKGtleSlgIG9uIGVhY2gga2V5IGluIGFuIG9iamVjdCB0cmVlLlxuICAgIC8vIGkuZS4gbWFraW5nIGFsbCBrZXlzIHVwcGVyY2FzZS5cbiAgICBkZWVwS2V5UmVwbGFjZTogZnVuY3Rpb24gKG9iaiwgZm4pIHtcbiAgICAgICAgdmFyIHJlYnVpbHRUcmVlID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqKTtcblxuICAgICAgICBmdW5jdGlvbiB0cmF2ZXJzZShvLCB4LCBmdW5jKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mKG8pID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBvKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvW2ldICE9PSBudWxsICYmICh0eXBlb2Yob1tpXSk9PVwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShvW2ldKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZ29pbmcgb24gc3RlcCBkb3duIGluIHRoZSBvYmplY3QgdHJlZSEhXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZXJzZShvW2ldLHhbaV0sZnVuYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZnVuYy5hcHBseSh0aGlzLFt4LCBpLCB4W2ldXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KG8pKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGZ1bmMuYXBwbHkodGhpcyxbbywgaSxvW2ldXSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvW2ldICE9PSBudWxsICYmICh0eXBlb2Yob1tpXSk9PVwib2JqZWN0XCIgfHwgQXJyYXkuaXNBcnJheShvW2ldKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vZ29pbmcgb24gc3RlcCBkb3duIGluIHRoZSBvYmplY3QgdHJlZSEhXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmF2ZXJzZShvW2ldLCB4W2ldLCBmdW5jKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRyYXZlcnNlKG9iaiwgcmVidWlsdFRyZWUsIGZ1bmN0aW9uIChwYXJlbnQsIGtleSwgdmFsKSB7XG4gICAgICAgICAgICBkZWxldGUgcGFyZW50W2tleV07XG4gICAgICAgICAgICBwYXJlbnRbZm4oa2V5KV0gPSB2YWw7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZWJ1aWx0VHJlZTtcbiAgICB9LFxuICAgIGRlZXBEZWNvZGU6IGZ1bmN0aW9uIChlbmNvZGVkVHJlZSkge1xuICAgICAgICB2YXIgJHRoaXMgPSB0aGlzO1xuXG4gICAgICAgIHZhciByZWJ1aWx0VHJlZSA9IHRoaXMuZGVlcEtleVJlcGxhY2UoZW5jb2RlZFRyZWUsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgIHJldHVybiAkdGhpcy5kZWNvZGUoa2V5KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJlYnVpbHRUcmVlO1xuICAgIH0sXG4gICAgZGVlcEVuY29kZTogZnVuY3Rpb24gKGRlY29kZWRUcmVlKSB7XG4gICAgICAgIHZhciAkdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdmFyIHJlYnVpbHRUcmVlID0gdGhpcy5kZWVwS2V5UmVwbGFjZShkZWNvZGVkVHJlZSwgZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgcmV0dXJuICR0aGlzLmVuY29kZShrZXkpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVidWlsdFRyZWU7XG4gICAgfVxufVxuIiwiY2xhc3MgV2ViUnRjUGVlciB7XG4gIGNvbnN0cnVjdG9yKGxvY2FsSWQsIHJlbW90ZUlkLCBzZW5kU2lnbmFsRnVuYykge1xuICAgIHRoaXMubG9jYWxJZCA9IGxvY2FsSWQ7XG4gICAgdGhpcy5yZW1vdGVJZCA9IHJlbW90ZUlkO1xuICAgIHRoaXMuc2VuZFNpZ25hbEZ1bmMgPSBzZW5kU2lnbmFsRnVuYztcbiAgICB0aGlzLm9wZW4gPSBmYWxzZTtcbiAgICB0aGlzLmNoYW5uZWxMYWJlbCA9IFwibmV0d29ya2VkLWFmcmFtZS1jaGFubmVsXCI7XG5cbiAgICB0aGlzLnBjID0gdGhpcy5jcmVhdGVQZWVyQ29ubmVjdGlvbigpO1xuICAgIHRoaXMuY2hhbm5lbCA9IG51bGw7XG4gIH1cblxuICBzZXREYXRhY2hhbm5lbExpc3RlbmVycyhvcGVuTGlzdGVuZXIsIGNsb3NlZExpc3RlbmVyLCBtZXNzYWdlTGlzdGVuZXIpIHtcbiAgICB0aGlzLm9wZW5MaXN0ZW5lciA9IG9wZW5MaXN0ZW5lcjtcbiAgICB0aGlzLmNsb3NlZExpc3RlbmVyID0gY2xvc2VkTGlzdGVuZXI7XG4gICAgdGhpcy5tZXNzYWdlTGlzdGVuZXIgPSBtZXNzYWdlTGlzdGVuZXI7XG4gIH1cblxuICBvZmZlcigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgLy8gcmVsaWFibGU6IGZhbHNlIC0gVURQXG4gICAgdGhpcy5zZXR1cENoYW5uZWwoXG4gICAgICB0aGlzLnBjLmNyZWF0ZURhdGFDaGFubmVsKHRoaXMuY2hhbm5lbExhYmVsLCB7IHJlbGlhYmxlOiBmYWxzZSB9KVxuICAgICk7XG4gICAgdGhpcy5wYy5jcmVhdGVPZmZlcihcbiAgICAgIGZ1bmN0aW9uKHNkcCkge1xuICAgICAgICBzZWxmLmhhbmRsZVNlc3Npb25EZXNjcmlwdGlvbihzZHApO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXZWJSdGNQZWVyLm9mZmVyOiBcIiArIGVycm9yKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlU2lnbmFsKHNpZ25hbCkge1xuICAgIC8vIGlnbm9yZXMgc2lnbmFsIGlmIGl0IGlzbid0IGZvciBtZVxuICAgIGlmICh0aGlzLmxvY2FsSWQgIT09IHNpZ25hbC50byB8fCB0aGlzLnJlbW90ZUlkICE9PSBzaWduYWwuZnJvbSkgcmV0dXJuO1xuXG4gICAgc3dpdGNoIChzaWduYWwudHlwZSkge1xuICAgICAgY2FzZSBcIm9mZmVyXCI6XG4gICAgICAgIHRoaXMuaGFuZGxlT2ZmZXIoc2lnbmFsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJhbnN3ZXJcIjpcbiAgICAgICAgdGhpcy5oYW5kbGVBbnN3ZXIoc2lnbmFsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgXCJjYW5kaWRhdGVcIjpcbiAgICAgICAgdGhpcy5oYW5kbGVDYW5kaWRhdGUoc2lnbmFsKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJXZWJSdGNQZWVyLmhhbmRsZVNpZ25hbDogVW5rbm93biBzaWduYWwgdHlwZSBcIiArIHNpZ25hbC50eXBlXG4gICAgICAgICk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHNlbmQodHlwZSwgZGF0YSkge1xuICAgIC8vIFRPRE86IHRocm93IGVycm9yP1xuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IG51bGwgfHwgdGhpcy5jaGFubmVsLnJlYWR5U3RhdGUgIT09IFwib3BlblwiKSByZXR1cm47XG5cbiAgICB0aGlzLmNoYW5uZWwuc2VuZChKU09OLnN0cmluZ2lmeSh7IHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfSkpO1xuICB9XG5cbiAgZ2V0U3RhdHVzKCkge1xuICAgIGlmICh0aGlzLmNoYW5uZWwgPT09IG51bGwpIHJldHVybiBXZWJSdGNQZWVyLk5PVF9DT05ORUNURUQ7XG5cbiAgICBzd2l0Y2ggKHRoaXMuY2hhbm5lbC5yZWFkeVN0YXRlKSB7XG4gICAgICBjYXNlIFwib3BlblwiOlxuICAgICAgICByZXR1cm4gV2ViUnRjUGVlci5JU19DT05ORUNURUQ7XG5cbiAgICAgIGNhc2UgXCJjb25uZWN0aW5nXCI6XG4gICAgICAgIHJldHVybiBXZWJSdGNQZWVyLkNPTk5FQ1RJTkc7XG5cbiAgICAgIGNhc2UgXCJjbG9zaW5nXCI6XG4gICAgICBjYXNlIFwiY2xvc2VkXCI6XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gV2ViUnRjUGVlci5OT1RfQ09OTkVDVEVEO1xuICAgIH1cbiAgfVxuXG4gIC8qXG4gICAgICogUHJpdmF0ZXNcbiAgICAgKi9cblxuICBjcmVhdGVQZWVyQ29ubmVjdGlvbigpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIFJUQ1BlZXJDb25uZWN0aW9uID1cbiAgICAgIHdpbmRvdy5SVENQZWVyQ29ubmVjdGlvbiB8fFxuICAgICAgd2luZG93LndlYmtpdFJUQ1BlZXJDb25uZWN0aW9uIHx8XG4gICAgICB3aW5kb3cubW96UlRDUGVlckNvbm5lY3Rpb24gfHxcbiAgICAgIHdpbmRvdy5tc1JUQ1BlZXJDb25uZWN0aW9uO1xuXG4gICAgaWYgKFJUQ1BlZXJDb25uZWN0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgXCJXZWJSdGNQZWVyLmNyZWF0ZVBlZXJDb25uZWN0aW9uOiBUaGlzIGJyb3dzZXIgZG9lcyBub3Qgc2VlbSB0byBzdXBwb3J0IFdlYlJUQy5cIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICB2YXIgcGMgPSBuZXcgUlRDUGVlckNvbm5lY3Rpb24oeyBpY2VTZXJ2ZXJzOiBXZWJSdGNQZWVyLklDRV9TRVJWRVJTIH0pO1xuXG4gICAgcGMub25pY2VjYW5kaWRhdGUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgaWYgKGV2ZW50LmNhbmRpZGF0ZSkge1xuICAgICAgICBzZWxmLnNlbmRTaWduYWxGdW5jKHtcbiAgICAgICAgICBmcm9tOiBzZWxmLmxvY2FsSWQsXG4gICAgICAgICAgdG86IHNlbGYucmVtb3RlSWQsXG4gICAgICAgICAgdHlwZTogXCJjYW5kaWRhdGVcIixcbiAgICAgICAgICBzZHBNTGluZUluZGV4OiBldmVudC5jYW5kaWRhdGUuc2RwTUxpbmVJbmRleCxcbiAgICAgICAgICBjYW5kaWRhdGU6IGV2ZW50LmNhbmRpZGF0ZS5jYW5kaWRhdGVcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIE5vdGU6IHNlZW1zIGxpa2UgY2hhbm5lbC5vbmNsb3NlIGhhbmRlciBpcyB1bnJlbGlhYmxlIG9uIHNvbWUgcGxhdGZvcm1zLFxuICAgIC8vICAgICAgIHNvIGFsc28gdHJpZXMgdG8gZGV0ZWN0IGRpc2Nvbm5lY3Rpb24gaGVyZS5cbiAgICBwYy5vbmljZWNvbm5lY3Rpb25zdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgaWYgKHNlbGYub3BlbiAmJiBwYy5pY2VDb25uZWN0aW9uU3RhdGUgPT09IFwiZGlzY29ubmVjdGVkXCIpIHtcbiAgICAgICAgc2VsZi5vcGVuID0gZmFsc2U7XG4gICAgICAgIHNlbGYuY2xvc2VkTGlzdGVuZXIoc2VsZi5yZW1vdGVJZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBwYztcbiAgfVxuXG4gIHNldHVwQ2hhbm5lbChjaGFubmVsKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbDtcblxuICAgIC8vIHJlY2VpdmVkIGRhdGEgZnJvbSBhIHJlbW90ZSBwZWVyXG4gICAgdGhpcy5jaGFubmVsLm9ubWVzc2FnZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICB2YXIgZGF0YSA9IEpTT04ucGFyc2UoZXZlbnQuZGF0YSk7XG4gICAgICBzZWxmLm1lc3NhZ2VMaXN0ZW5lcihzZWxmLnJlbW90ZUlkLCBkYXRhLnR5cGUsIGRhdGEuZGF0YSk7XG4gICAgfTtcblxuICAgIC8vIGNvbm5lY3RlZCB3aXRoIGEgcmVtb3RlIHBlZXJcbiAgICB0aGlzLmNoYW5uZWwub25vcGVuID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIHNlbGYub3BlbiA9IHRydWU7XG4gICAgICBzZWxmLm9wZW5MaXN0ZW5lcihzZWxmLnJlbW90ZUlkKTtcbiAgICB9O1xuXG4gICAgLy8gZGlzY29ubmVjdGVkIHdpdGggYSByZW1vdGUgcGVlclxuICAgIHRoaXMuY2hhbm5lbC5vbmNsb3NlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGlmICghc2VsZi5vcGVuKSByZXR1cm47XG4gICAgICBzZWxmLm9wZW4gPSBmYWxzZTtcbiAgICAgIHNlbGYuY2xvc2VkTGlzdGVuZXIoc2VsZi5yZW1vdGVJZCk7XG4gICAgfTtcblxuICAgIC8vIGVycm9yIG9jY3VycmVkIHdpdGggYSByZW1vdGUgcGVlclxuICAgIHRoaXMuY2hhbm5lbC5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJXZWJSdGNQZWVyLmNoYW5uZWwub25lcnJvcjogXCIgKyBlcnJvcik7XG4gICAgfTtcbiAgfVxuXG4gIGhhbmRsZU9mZmVyKG1lc3NhZ2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnBjLm9uZGF0YWNoYW5uZWwgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgc2VsZi5zZXR1cENoYW5uZWwoZXZlbnQuY2hhbm5lbCk7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0UmVtb3RlRGVzY3JpcHRpb24obWVzc2FnZSk7XG5cbiAgICB0aGlzLnBjLmNyZWF0ZUFuc3dlcihcbiAgICAgIGZ1bmN0aW9uKHNkcCkge1xuICAgICAgICBzZWxmLmhhbmRsZVNlc3Npb25EZXNjcmlwdGlvbihzZHApO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXZWJSdGNQZWVyLmhhbmRsZU9mZmVyOiBcIiArIGVycm9yKTtcbiAgICAgIH1cbiAgICApO1xuICB9XG5cbiAgaGFuZGxlQW5zd2VyKG1lc3NhZ2UpIHtcbiAgICB0aGlzLnNldFJlbW90ZURlc2NyaXB0aW9uKG1lc3NhZ2UpO1xuICB9XG5cbiAgaGFuZGxlQ2FuZGlkYXRlKG1lc3NhZ2UpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIFJUQ0ljZUNhbmRpZGF0ZSA9XG4gICAgICB3aW5kb3cuUlRDSWNlQ2FuZGlkYXRlIHx8XG4gICAgICB3aW5kb3cud2Via2l0UlRDSWNlQ2FuZGlkYXRlIHx8XG4gICAgICB3aW5kb3cubW96UlRDSWNlQ2FuZGlkYXRlO1xuXG4gICAgdGhpcy5wYy5hZGRJY2VDYW5kaWRhdGUoXG4gICAgICBuZXcgUlRDSWNlQ2FuZGlkYXRlKG1lc3NhZ2UpLFxuICAgICAgZnVuY3Rpb24oKSB7fSxcbiAgICAgIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXZWJSdGNQZWVyLmhhbmRsZUNhbmRpZGF0ZTogXCIgKyBlcnJvcik7XG4gICAgICB9XG4gICAgKTtcbiAgfVxuXG4gIGhhbmRsZVNlc3Npb25EZXNjcmlwdGlvbihzZHApIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB0aGlzLnBjLnNldExvY2FsRGVzY3JpcHRpb24oXG4gICAgICBzZHAsXG4gICAgICBmdW5jdGlvbigpIHt9LFxuICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIldlYlJ0Y1BlZXIuaGFuZGxlU2Vzc2lvbkRlc2NyaXB0aW9uOiBcIiArIGVycm9yKTtcbiAgICAgIH1cbiAgICApO1xuXG4gICAgdGhpcy5zZW5kU2lnbmFsRnVuYyh7XG4gICAgICBmcm9tOiB0aGlzLmxvY2FsSWQsXG4gICAgICB0bzogdGhpcy5yZW1vdGVJZCxcbiAgICAgIHR5cGU6IHNkcC50eXBlLFxuICAgICAgc2RwOiBzZHAuc2RwXG4gICAgfSk7XG4gIH1cblxuICBzZXRSZW1vdGVEZXNjcmlwdGlvbihtZXNzYWdlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBSVENTZXNzaW9uRGVzY3JpcHRpb24gPVxuICAgICAgd2luZG93LlJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxuICAgICAgd2luZG93LndlYmtpdFJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxuICAgICAgd2luZG93Lm1velJUQ1Nlc3Npb25EZXNjcmlwdGlvbiB8fFxuICAgICAgd2luZG93Lm1zUlRDU2Vzc2lvbkRlc2NyaXB0aW9uO1xuXG4gICAgdGhpcy5wYy5zZXRSZW1vdGVEZXNjcmlwdGlvbihcbiAgICAgIG5ldyBSVENTZXNzaW9uRGVzY3JpcHRpb24obWVzc2FnZSksXG4gICAgICBmdW5jdGlvbigpIHt9LFxuICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIldlYlJ0Y1BlZXIuc2V0UmVtb3RlRGVzY3JpcHRpb246IFwiICsgZXJyb3IpO1xuICAgICAgfVxuICAgICk7XG4gIH1cbn1cblxuV2ViUnRjUGVlci5JU19DT05ORUNURUQgPSBcIklTX0NPTk5FQ1RFRFwiO1xuV2ViUnRjUGVlci5DT05ORUNUSU5HID0gXCJDT05ORUNUSU5HXCI7XG5XZWJSdGNQZWVyLk5PVF9DT05ORUNURUQgPSBcIk5PVF9DT05ORUNURURcIjtcblxuV2ViUnRjUGVlci5JQ0VfU0VSVkVSUyA9IFtcbiAgeyB1cmxzOiBcInN0dW46c3R1bjEubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgeyB1cmxzOiBcInN0dW46c3R1bjIubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgeyB1cmxzOiBcInN0dW46c3R1bjMubC5nb29nbGUuY29tOjE5MzAyXCIgfSxcbiAgeyB1cmxzOiBcInN0dW46c3R1bjQubC5nb29nbGUuY29tOjE5MzAyXCIgfVxuXTtcblxubW9kdWxlLmV4cG9ydHMgPSBXZWJSdGNQZWVyO1xuIiwiY29uc3QgZmlyZWJhc2VLZXlFbmNvZGUgPSByZXF1aXJlKFwiZmlyZWJhc2Uta2V5LWVuY29kZVwiKTtcbmNvbnN0IFdlYlJ0Y1BlZXIgPSByZXF1aXJlKFwiLi9XZWJSdGNQZWVyXCIpO1xuXG5jbGFzcyBGaXJlYmFzZVdlYlJ0Y0FkYXB0ZXIge1xuICAvKipcbiAgICBDb25maWcgc3RydWN0dXJlOlxuICAgIGNvbmZpZy5hdXRoVHlwZTogbm9uZTtcbiAgICBjb25maWcuYXBpS2V5OiB5b3VyLWFwaTtcbiAgICBjb25maWcuYXV0aERvbWFpbjogeW91ci1wcm9qZWN0LmZpcmViYXNlYXBwLmNvbTtcbiAgICBjb25maWcuZGF0YWJhc2VVUkw6IGh0dHBzOi8veW91ci1wcm9qZWN0LmZpcmViYXNlaW8uY29tO1xuICAqL1xuICBjb25zdHJ1Y3RvcihmaXJlYmFzZSwgY29uZmlnKSB7XG4gICAgdGhpcy5yb290UGF0aCA9IFwibmV0d29ya2VkLWFmcmFtZVwiO1xuXG4gICAgdGhpcy5sb2NhbElkID0gbnVsbDtcbiAgICB0aGlzLmFwcElkID0gbnVsbDtcbiAgICB0aGlzLnJvb21JZCA9IG51bGw7XG5cbiAgICB0aGlzLnBlZXJzID0ge307IC8vIGlkIC0+IFdlYlJ0Y1BlZXJcbiAgICB0aGlzLm9jY3VwYW50cyA9IHt9OyAvLyBpZCAtPiBqb2luVGltZXN0YW1wXG5cbiAgICB0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA9IDA7XG4gICAgdGhpcy50aW1lT2Zmc2V0cyA9IFtdO1xuICAgIHRoaXMuYXZnVGltZU9mZnNldCA9IDA7XG5cbiAgICBjb25maWcgPSBjb25maWcgfHwgd2luZG93LmZpcmViYXNlQ29uZmlnO1xuICAgIHRoaXMuZmlyZWJhc2UgPSBmaXJlYmFzZSB8fCB3aW5kb3cuZmlyZWJhc2U7XG5cbiAgICBpZiAodGhpcy5maXJlYmFzZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFwiSW1wb3J0IGh0dHBzOi8vd3d3LmdzdGF0aWMuY29tL2ZpcmViYXNlanMveC54LngvZmlyZWJhc2UuanNcIlxuICAgICAgKTtcbiAgICB9XG5cbiAgICB0aGlzLmF1dGhUeXBlID0gY29uZmlnLmF1dGhUeXBlO1xuICAgIHRoaXMuYXBpS2V5ID0gY29uZmlnLmFwaUtleTtcbiAgICB0aGlzLmF1dGhEb21haW4gPSBjb25maWcuYXV0aERvbWFpbjtcbiAgICB0aGlzLmRhdGFiYXNlVVJMID0gY29uZmlnLmRhdGFiYXNlVVJMO1xuICB9XG5cbiAgLypcbiAgICogQ2FsbCBiZWZvcmUgYGNvbm5lY3RgXG4gICAqL1xuXG4gIHNldFNlcnZlclVybCh1cmwpIHtcbiAgICAvLyBoYW5kbGVkIGluIGNvbmZpZ1xuICB9XG5cbiAgc2V0QXBwKGFwcElkKSB7XG4gICAgdGhpcy5hcHBJZCA9IGFwcElkO1xuICB9XG5cbiAgc2V0Um9vbShyb29tSWQpIHtcbiAgICB0aGlzLnJvb21JZCA9IHJvb21JZDtcbiAgfVxuXG4gIC8vIG9wdGlvbnM6IHsgZGF0YWNoYW5uZWw6IGJvb2wsIGF1ZGlvOiBib29sIH1cbiAgc2V0V2ViUnRjT3B0aW9ucyhvcHRpb25zKSB7XG4gICAgLy8gVE9ETzogc3VwcG9ydCBhdWRpbyBhbmQgdmlkZW9cbiAgICBpZiAob3B0aW9ucy5kYXRhY2hhbm5lbCA9PT0gZmFsc2UpXG4gICAgICBOQUYubG9nLndhcm4oXG4gICAgICAgIFwiRmlyZWJhc2VXZWJSdGNBZGFwdGVyLnNldFdlYlJ0Y09wdGlvbnM6IGRhdGFjaGFubmVsIG11c3QgYmUgdHJ1ZS5cIlxuICAgICAgKTtcbiAgICBpZiAob3B0aW9ucy5hdWRpbyA9PT0gdHJ1ZSlcbiAgICAgIE5BRi5sb2cud2FybihcIkZpcmViYXNlV2ViUnRjQWRhcHRlciBkb2VzIG5vdCBzdXBwb3J0IGF1ZGlvIHlldC5cIik7XG4gICAgaWYgKG9wdGlvbnMudmlkZW8gPT09IHRydWUpXG4gICAgICBOQUYubG9nLndhcm4oXCJGaXJlYmFzZVdlYlJ0Y0FkYXB0ZXIgZG9lcyBub3Qgc3VwcG9ydCB2aWRlbyB5ZXQuXCIpO1xuICB9XG5cbiAgc2V0U2VydmVyQ29ubmVjdExpc3RlbmVycyhzdWNjZXNzTGlzdGVuZXIsIGZhaWx1cmVMaXN0ZW5lcikge1xuICAgIHRoaXMuY29ubmVjdFN1Y2Nlc3MgPSBzdWNjZXNzTGlzdGVuZXI7XG4gICAgdGhpcy5jb25uZWN0RmFpbHVyZSA9IGZhaWx1cmVMaXN0ZW5lcjtcbiAgfVxuXG4gIHNldFJvb21PY2N1cGFudExpc3RlbmVyKG9jY3VwYW50TGlzdGVuZXIpIHtcbiAgICB0aGlzLm9jY3VwYW50TGlzdGVuZXIgPSBvY2N1cGFudExpc3RlbmVyO1xuICB9XG5cbiAgc2V0RGF0YUNoYW5uZWxMaXN0ZW5lcnMob3Blbkxpc3RlbmVyLCBjbG9zZWRMaXN0ZW5lciwgbWVzc2FnZUxpc3RlbmVyKSB7XG4gICAgdGhpcy5vcGVuTGlzdGVuZXIgPSBvcGVuTGlzdGVuZXI7XG4gICAgdGhpcy5jbG9zZWRMaXN0ZW5lciA9IGNsb3NlZExpc3RlbmVyO1xuICAgIHRoaXMubWVzc2FnZUxpc3RlbmVyID0gZnVuY3Rpb24ocmVtb3RlSWQsIGRhdGFUeXBlLCBkYXRhKSB7XG4gICAgICB2YXIgZGVjb2RlZERhdGEgPSBmaXJlYmFzZUtleUVuY29kZS5kZWVwRGVjb2RlKGRhdGEpO1xuICAgICAgbWVzc2FnZUxpc3RlbmVyKHJlbW90ZUlkLCBkYXRhVHlwZSwgZGVjb2RlZERhdGEpO1xuICAgIH07XG4gIH1cblxuICBjb25uZWN0KCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHRoaXMuaW5pdEZpcmViYXNlKGZ1bmN0aW9uKGlkKSB7XG4gICAgICBzZWxmLnVwZGF0ZVRpbWVPZmZzZXQoKTtcblxuICAgICAgc2VsZi5sb2NhbElkID0gaWQ7XG4gICAgICB2YXIgZmlyZWJhc2VBcHAgPSBzZWxmLmZpcmViYXNlQXBwO1xuXG4gICAgICAvLyBOb3RlOiBhc3N1bWluZyB0aGF0IGRhdGEgdHJhbnNmZXIgdmlhIGZpcmViYXNlIHJlYWx0aW1lIGRhdGFiYXNlXG4gICAgICAvLyAgICAgICBpcyByZWxpYWJsZSBhbmQgaW4gb3JkZXJcbiAgICAgIC8vIFRPRE86IGNhbiByYWNlIGFtb25nIHBlZXJzPyBJZiBzbywgZml4XG5cbiAgICAgIHNlbGYuZ2V0VGltZXN0YW1wKGZ1bmN0aW9uKHRpbWVzdGFtcCkge1xuICAgICAgICBzZWxmLm15Um9vbUpvaW5UaW1lID0gdGltZXN0YW1wO1xuXG4gICAgICAgIHZhciB1c2VyUmVmID0gZmlyZWJhc2VBcHBcbiAgICAgICAgICAuZGF0YWJhc2UoKVxuICAgICAgICAgIC5yZWYoc2VsZi5nZXRVc2VyUGF0aChzZWxmLmxvY2FsSWQpKTtcbiAgICAgICAgdXNlclJlZi5zZXQoeyB0aW1lc3RhbXA6IHRpbWVzdGFtcCwgc2lnbmFsOiBcIlwiLCBkYXRhOiBcIlwiIH0pO1xuICAgICAgICB1c2VyUmVmLm9uRGlzY29ubmVjdCgpLnJlbW92ZSgpO1xuXG4gICAgICAgIHZhciByb29tUmVmID0gZmlyZWJhc2VBcHAuZGF0YWJhc2UoKS5yZWYoc2VsZi5nZXRSb29tUGF0aCgpKTtcblxuICAgICAgICByb29tUmVmLm9uKFwiY2hpbGRfYWRkZWRcIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgIHZhciByZW1vdGVJZCA9IGRhdGEua2V5O1xuXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgcmVtb3RlSWQgPT09IHNlbGYubG9jYWxJZCB8fFxuICAgICAgICAgICAgcmVtb3RlSWQgPT09IFwidGltZXN0YW1wXCIgfHxcbiAgICAgICAgICAgIHNlbGYucGVlcnNbcmVtb3RlSWRdICE9PSB1bmRlZmluZWRcbiAgICAgICAgICApXG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICB2YXIgcmVtb3RlVGltZXN0YW1wID0gZGF0YS52YWwoKS50aW1lc3RhbXA7XG5cbiAgICAgICAgICB2YXIgcGVlciA9IG5ldyBXZWJSdGNQZWVyKFxuICAgICAgICAgICAgc2VsZi5sb2NhbElkLFxuICAgICAgICAgICAgcmVtb3RlSWQsXG4gICAgICAgICAgICAvLyBzZW5kIHNpZ25hbCBmdW5jdGlvblxuICAgICAgICAgICAgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICBmaXJlYmFzZUFwcFxuICAgICAgICAgICAgICAgIC5kYXRhYmFzZSgpXG4gICAgICAgICAgICAgICAgLnJlZihzZWxmLmdldFNpZ25hbFBhdGgoc2VsZi5sb2NhbElkKSlcbiAgICAgICAgICAgICAgICAuc2V0KGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICk7XG4gICAgICAgICAgcGVlci5zZXREYXRhY2hhbm5lbExpc3RlbmVycyhcbiAgICAgICAgICAgIHNlbGYub3Blbkxpc3RlbmVyLFxuICAgICAgICAgICAgc2VsZi5jbG9zZWRMaXN0ZW5lcixcbiAgICAgICAgICAgIHNlbGYubWVzc2FnZUxpc3RlbmVyXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIHNlbGYucGVlcnNbcmVtb3RlSWRdID0gcGVlcjtcbiAgICAgICAgICBzZWxmLm9jY3VwYW50c1tyZW1vdGVJZF0gPSByZW1vdGVUaW1lc3RhbXA7XG5cbiAgICAgICAgICAvLyByZWNlaXZlZCBzaWduYWxcbiAgICAgICAgICBmaXJlYmFzZUFwcFxuICAgICAgICAgICAgLmRhdGFiYXNlKClcbiAgICAgICAgICAgIC5yZWYoc2VsZi5nZXRTaWduYWxQYXRoKHJlbW90ZUlkKSlcbiAgICAgICAgICAgIC5vbihcInZhbHVlXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZGF0YS52YWwoKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiKSByZXR1cm47XG4gICAgICAgICAgICAgIHBlZXIuaGFuZGxlU2lnbmFsKHZhbHVlKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gcmVjZWl2ZWQgZGF0YVxuICAgICAgICAgIGZpcmViYXNlQXBwXG4gICAgICAgICAgICAuZGF0YWJhc2UoKVxuICAgICAgICAgICAgLnJlZihzZWxmLmdldERhdGFQYXRoKHJlbW90ZUlkKSlcbiAgICAgICAgICAgIC5vbihcInZhbHVlXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZGF0YS52YWwoKTtcbiAgICAgICAgICAgICAgaWYgKHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSBcIlwiIHx8IHZhbHVlLnRvICE9PSBzZWxmLmxvY2FsSWQpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICBzZWxmLm1lc3NhZ2VMaXN0ZW5lcihyZW1vdGVJZCwgdmFsdWUudHlwZSwgdmFsdWUuZGF0YSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIHNlbmQgb2ZmZXIgZnJvbSBhIHBlZXIgd2hvXG4gICAgICAgICAgLy8gICAtIGxhdGVyIGpvaW5lZCB0aGUgcm9vbSwgb3JcbiAgICAgICAgICAvLyAgIC0gaGFzIGxhcmdlciBpZCBpZiB0d28gcGVlcnMgam9pbmVkIHRoZSByb29tIGF0IHNhbWUgdGltZVxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHRpbWVzdGFtcCA+IHJlbW90ZVRpbWVzdGFtcCB8fFxuICAgICAgICAgICAgKHRpbWVzdGFtcCA9PT0gcmVtb3RlVGltZXN0YW1wICYmIHNlbGYubG9jYWxJZCA+IHJlbW90ZUlkKVxuICAgICAgICAgIClcbiAgICAgICAgICAgIHBlZXIub2ZmZXIoKTtcblxuICAgICAgICAgIHNlbGYub2NjdXBhbnRMaXN0ZW5lcihzZWxmLm9jY3VwYW50cyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJvb21SZWYub24oXCJjaGlsZF9yZW1vdmVkXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICB2YXIgcmVtb3RlSWQgPSBkYXRhLmtleTtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHJlbW90ZUlkID09PSBzZWxmLmxvY2FsSWQgfHxcbiAgICAgICAgICAgIHJlbW90ZUlkID09PSBcInRpbWVzdGFtcFwiIHx8XG4gICAgICAgICAgICBzZWxmLnBlZXJzW3JlbW90ZUlkXSA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgKVxuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgZGVsZXRlIHNlbGYucGVlcnNbcmVtb3RlSWRdO1xuICAgICAgICAgIGRlbGV0ZSBzZWxmLm9jY3VwYW50c1tyZW1vdGVJZF07XG5cbiAgICAgICAgICBzZWxmLm9jY3VwYW50TGlzdGVuZXIoc2VsZi5vY2N1cGFudHMpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZWxmLmNvbm5lY3RTdWNjZXNzKHNlbGYubG9jYWxJZCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNob3VsZFN0YXJ0Q29ubmVjdGlvblRvKGNsaWVudCkge1xuICAgIHJldHVybiAodGhpcy5teVJvb21Kb2luVGltZSB8fCAwKSA8PSAoY2xpZW50ID8gY2xpZW50LnJvb21Kb2luVGltZSA6IDApO1xuICB9XG5cbiAgc3RhcnRTdHJlYW1Db25uZWN0aW9uKGNsaWVudElkKSB7XG4gICAgLy8gSGFuZGxlZCBieSBXZWJSdGNQZWVyXG4gIH1cblxuICBjbG9zZVN0cmVhbUNvbm5lY3Rpb24oY2xpZW50SWQpIHtcbiAgICAvLyBIYW5kbGVkIGJ5IFdlYlJ0Y1BlZXJcbiAgfVxuXG4gIHNlbmREYXRhKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIHRoaXMucGVlcnNbY2xpZW50SWRdLnNlbmQoZGF0YVR5cGUsIGRhdGEpO1xuICB9XG5cbiAgc2VuZERhdGFHdWFyYW50ZWVkKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSkge1xuICAgIHZhciBjbG9uZWREYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gICAgdmFyIGVuY29kZWREYXRhID0gZmlyZWJhc2VLZXlFbmNvZGUuZGVlcEVuY29kZShjbG9uZWREYXRhKTtcbiAgICB0aGlzLmZpcmViYXNlQXBwXG4gICAgICAuZGF0YWJhc2UoKVxuICAgICAgLnJlZih0aGlzLmdldERhdGFQYXRoKHRoaXMubG9jYWxJZCkpXG4gICAgICAuc2V0KHtcbiAgICAgICAgdG86IGNsaWVudElkLFxuICAgICAgICB0eXBlOiBkYXRhVHlwZSxcbiAgICAgICAgZGF0YTogZW5jb2RlZERhdGFcbiAgICAgIH0pO1xuICB9XG5cbiAgYnJvYWRjYXN0RGF0YShkYXRhVHlwZSwgZGF0YSkge1xuICAgIGZvciAodmFyIGNsaWVudElkIGluIHRoaXMucGVlcnMpIHtcbiAgICAgIGlmICh0aGlzLnBlZXJzLmhhc093blByb3BlcnR5KGNsaWVudElkKSkge1xuICAgICAgICB0aGlzLnNlbmREYXRhKGNsaWVudElkLCBkYXRhVHlwZSwgZGF0YSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgYnJvYWRjYXN0RGF0YUd1YXJhbnRlZWQoZGF0YVR5cGUsIGRhdGEpIHtcbiAgICBmb3IgKHZhciBjbGllbnRJZCBpbiB0aGlzLnBlZXJzKSB7XG4gICAgICBpZiAodGhpcy5wZWVycy5oYXNPd25Qcm9wZXJ0eShjbGllbnRJZCkpIHtcbiAgICAgICAgdGhpcy5zZW5kRGF0YUd1YXJhbnRlZWQoY2xpZW50SWQsIGRhdGFUeXBlLCBkYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRDb25uZWN0U3RhdHVzKGNsaWVudElkKSB7XG4gICAgdmFyIHBlZXIgPSB0aGlzLnBlZXJzW2NsaWVudElkXTtcblxuICAgIGlmIChwZWVyID09PSB1bmRlZmluZWQpIHJldHVybiBOQUYuYWRhcHRlcnMuTk9UX0NPTk5FQ1RFRDtcblxuICAgIHN3aXRjaCAocGVlci5nZXRTdGF0dXMoKSkge1xuICAgICAgY2FzZSBXZWJSdGNQZWVyLklTX0NPTk5FQ1RFRDpcbiAgICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5JU19DT05ORUNURUQ7XG5cbiAgICAgIGNhc2UgV2ViUnRjUGVlci5DT05ORUNUSU5HOlxuICAgICAgICByZXR1cm4gTkFGLmFkYXB0ZXJzLkNPTk5FQ1RJTkc7XG5cbiAgICAgIGNhc2UgV2ViUnRjUGVlci5OT1RfQ09OTkVDVEVEOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIE5BRi5hZGFwdGVycy5OT1RfQ09OTkVDVEVEO1xuICAgIH1cbiAgfVxuXG4gIGdldE1lZGlhU3RyZWFtKGNsaWVudElkKSB7IHJldHVybiBQcm9taXNlLnJlamVjdChcIkludGVyZmFjZSBtZXRob2Qgbm90IGltcGxlbWVudGVkOiBnZXRNZWRpYVN0cmVhbVwiKX1cblxuICAvKlxuICAgKiBQcml2YXRlc1xuICAgKi9cblxuICBpbml0RmlyZWJhc2UoY2FsbGJhY2spIHtcbiAgICB0aGlzLmZpcmViYXNlQXBwID0gdGhpcy5maXJlYmFzZS5pbml0aWFsaXplQXBwKFxuICAgICAge1xuICAgICAgICBhcGlLZXk6IHRoaXMuYXBpS2V5LFxuICAgICAgICBhdXRoRG9tYWluOiB0aGlzLmF1dGhEb21haW4sXG4gICAgICAgIGRhdGFiYXNlVVJMOiB0aGlzLmRhdGFiYXNlVVJMXG4gICAgICB9LFxuICAgICAgdGhpcy5hcHBJZFxuICAgICk7XG5cbiAgICB0aGlzLmF1dGgodGhpcy5hdXRoVHlwZSwgY2FsbGJhY2spO1xuICB9XG5cbiAgYXV0aCh0eXBlLCBjYWxsYmFjaykge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSBcIm5vbmVcIjpcbiAgICAgICAgdGhpcy5hdXRoTm9uZShjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIFwiYW5vbnltb3VzXCI6XG4gICAgICAgIHRoaXMuYXV0aEFub255bW91cyhjYWxsYmFjayk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICAvLyBUT0RPOiBzdXBwb3J0IG90aGVyIGF1dGggdHlwZVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgTkFGLmxvZy5sb2coXCJGaXJlYmFzZVdlYlJ0Y0ludGVyZmFjZS5hdXRoOiBVbmtub3duIGF1dGhUeXBlIFwiICsgdHlwZSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGF1dGhOb25lKGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gYXN5bmNocm9ub3VzbHkgaW52b2tlcyBvcGVuIGxpc3RlbmVycyBmb3IgdGhlIGNvbXBhdGliaWxpdHkgd2l0aCBvdGhlciBhdXRoIHR5cGVzLlxuICAgIC8vIFRPRE86IGdlbmVyYXRlIG5vdCBqdXN0IHJhbmRvbSBidXQgYWxzbyB1bmlxdWUgaWRcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICBjYWxsYmFjayhzZWxmLnJhbmRvbVN0cmluZygpKTtcbiAgICB9KTtcbiAgfVxuXG4gIGF1dGhBbm9ueW1vdXMoY2FsbGJhY2spIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGZpcmViYXNlQXBwID0gdGhpcy5maXJlYmFzZUFwcDtcblxuICAgIGZpcmViYXNlQXBwXG4gICAgICAuYXV0aCgpXG4gICAgICAuc2lnbkluQW5vbnltb3VzbHkoKVxuICAgICAgLmNhdGNoKGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgIE5BRi5sb2cuZXJyb3IoXCJGaXJlYmFzZVdlYlJ0Y0ludGVyZmFjZS5hdXRoQW5vbnltb3VzOiBcIiArIGVycm9yKTtcbiAgICAgICAgc2VsZi5jb25uZWN0RmFpbHVyZShudWxsLCBlcnJvcik7XG4gICAgICB9KTtcblxuICAgIGZpcmViYXNlQXBwLmF1dGgoKS5vbkF1dGhTdGF0ZUNoYW5nZWQoZnVuY3Rpb24odXNlcikge1xuICAgICAgaWYgKHVzZXIgIT09IG51bGwpIHtcbiAgICAgICAgY2FsbGJhY2sodXNlci51aWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLypcbiAgICogcmVhbHRpbWUgZGF0YWJhc2UgbGF5b3V0XG4gICAqXG4gICAqIC9yb290UGF0aC9hcHBJZC9yb29tSWQvXG4gICAqICAgLSAvdXNlcklkL1xuICAgKiAgICAgLSB0aW1lc3RhbXA6IGpvaW5pbmcgdGhlIHJvb20gdGltZXN0YW1wXG4gICAqICAgICAtIHNpZ25hbDogdXNlZCB0byBzZW5kIHNpZ25hbFxuICAgKiAgICAgLSBkYXRhOiB1c2VkIHRvIHNlbmQgZ3VhcmFudGVlZCBkYXRhXG4gICAqICAgLSAvdGltZXN0YW1wLzogd29ya2luZyBwYXRoIHRvIGdldCB0aW1lc3RhbXBcbiAgICogICAgIC0gdXNlcklkOlxuICAgKi9cblxuICBnZXRSb290UGF0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5yb290UGF0aDtcbiAgfVxuXG4gIGdldEFwcFBhdGgoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Um9vdFBhdGgoKSArIFwiL1wiICsgdGhpcy5hcHBJZDtcbiAgfVxuXG4gIGdldFJvb21QYXRoKCkge1xuICAgIHJldHVybiB0aGlzLmdldEFwcFBhdGgoKSArIFwiL1wiICsgdGhpcy5yb29tSWQ7XG4gIH1cblxuICBnZXRVc2VyUGF0aChpZCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb21QYXRoKCkgKyBcIi9cIiArIGlkO1xuICB9XG5cbiAgZ2V0U2lnbmFsUGF0aChpZCkge1xuICAgIHJldHVybiB0aGlzLmdldFVzZXJQYXRoKGlkKSArIFwiL3NpZ25hbFwiO1xuICB9XG5cbiAgZ2V0RGF0YVBhdGgoaWQpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRVc2VyUGF0aChpZCkgKyBcIi9kYXRhXCI7XG4gIH1cblxuICBnZXRUaW1lc3RhbXBHZW5lcmF0aW9uUGF0aChpZCkge1xuICAgIHJldHVybiB0aGlzLmdldFJvb21QYXRoKCkgKyBcIi90aW1lc3RhbXAvXCIgKyBpZDtcbiAgfVxuXG4gIHJhbmRvbVN0cmluZygpIHtcbiAgICB2YXIgc3RyaW5nTGVuZ3RoID0gMTY7XG4gICAgdmFyIGNoYXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hUWmFiY2RlZmdoaWtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5XCI7XG4gICAgdmFyIHN0cmluZyA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHN0cmluZ0xlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcmFuZG9tTnVtYmVyID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY2hhcnMubGVuZ3RoKTtcbiAgICAgIHN0cmluZyArPSBjaGFycy5zdWJzdHJpbmcocmFuZG9tTnVtYmVyLCByYW5kb21OdW1iZXIgKyAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG5cbiAgZ2V0VGltZXN0YW1wKGNhbGxiYWNrKSB7XG4gICAgdmFyIGZpcmViYXNlQXBwID0gdGhpcy5maXJlYmFzZUFwcDtcbiAgICB2YXIgcmVmID0gZmlyZWJhc2VBcHBcbiAgICAgIC5kYXRhYmFzZSgpXG4gICAgICAucmVmKHRoaXMuZ2V0VGltZXN0YW1wR2VuZXJhdGlvblBhdGgodGhpcy5sb2NhbElkKSk7XG4gICAgcmVmLnNldCh0aGlzLmZpcmViYXNlLmRhdGFiYXNlLlNlcnZlclZhbHVlLlRJTUVTVEFNUCk7XG4gICAgcmVmLm9uY2UoXCJ2YWx1ZVwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICB2YXIgdGltZXN0YW1wID0gZGF0YS52YWwoKTtcbiAgICAgIHJlZi5yZW1vdmUoKTtcbiAgICAgIGNhbGxiYWNrKHRpbWVzdGFtcCk7XG4gICAgfSk7XG4gICAgcmVmLm9uRGlzY29ubmVjdCgpLnJlbW92ZSgpO1xuICB9XG5cbiAgdXBkYXRlVGltZU9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5maXJlYmFzZUFwcFxuICAgICAgLmRhdGFiYXNlKClcbiAgICAgIC5yZWYoXCIvLmluZm8vc2VydmVyVGltZU9mZnNldFwiKVxuICAgICAgLm9uY2UoXCJ2YWx1ZVwiKVxuICAgICAgLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgIHZhciB0aW1lT2Zmc2V0ID0gZGF0YS52YWwoKTtcblxuICAgICAgICB0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cysrO1xuXG4gICAgICAgIGlmICh0aGlzLnNlcnZlclRpbWVSZXF1ZXN0cyA8PSAxMCkge1xuICAgICAgICAgIHRoaXMudGltZU9mZnNldHMucHVzaCh0aW1lT2Zmc2V0KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnRpbWVPZmZzZXRzW3RoaXMuc2VydmVyVGltZVJlcXVlc3RzICUgMTBdID0gdGltZU9mZnNldDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXZnVGltZU9mZnNldCA9XG4gICAgICAgICAgdGhpcy50aW1lT2Zmc2V0cy5yZWR1Y2UoKGFjYywgb2Zmc2V0KSA9PiAoYWNjICs9IG9mZnNldCksIDApIC9cbiAgICAgICAgICB0aGlzLnRpbWVPZmZzZXRzLmxlbmd0aDtcblxuICAgICAgICBpZiAodGhpcy5zZXJ2ZXJUaW1lUmVxdWVzdHMgPiAxMCkge1xuICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy51cGRhdGVUaW1lT2Zmc2V0KCksIDUgKiA2MCAqIDEwMDApOyAvLyBTeW5jIGNsb2NrIGV2ZXJ5IDUgbWludXRlcy5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZVRpbWVPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1cblxuICBnZXRTZXJ2ZXJUaW1lKCkge1xuICAgIHJldHVybiBuZXcgRGF0ZSgpICsgdGhpcy5hdmdUaW1lT2Zmc2V0O1xuICB9XG59XG5cbk5BRi5hZGFwdGVycy5yZWdpc3RlcihcImZpcmViYXNlXCIsIEZpcmViYXNlV2ViUnRjQWRhcHRlcik7XG5cbm1vZHVsZS5leHBvcnRzID0gRmlyZWJhc2VXZWJSdGNBZGFwdGVyO1xuIl0sInNvdXJjZVJvb3QiOiIifQ==