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
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["TripsUpdated"] = 1] = "TripsUpdated";
    MessageType[MessageType["RunNextTrip"] = 2] = "RunNextTrip";
})(MessageType = exports.MessageType || (exports.MessageType = {}));


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const tabs_1 = __webpack_require__(2);
class Messaging {
    constructor(origin) {
        this.origin = origin;
        this.tabId = 0;
        if (this.origin === 'popup')
            tabs_1.Tabs.useDefaultId(tabId => this.tabId = tabId);
    }
    send(messageType, messageValue, responseCallback) {
        this.origin === 'popup' ?
            chrome.tabs.sendMessage(this.tabId, this.message(messageType, messageValue), responseCallback) :
            chrome.runtime.sendMessage(this.message(messageType, messageValue), responseCallback);
    }
    subscribe(messageType, action, responseCallback) {
        console.log('subscribed called');
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            console.log('got message that looks like:', message);
            if (message[messageType])
                action();
        });
    }
    message(messageType, messageValue) {
        return {
            type: messageType,
            value: messageValue ? messageValue : undefined
        };
    }
}
exports.Messaging = Messaging;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = __webpack_require__(8);
class Tabs {
    static useDefaultId(callback) {
        chrome.tabs && chrome.tabs.query({ url: environment_1.environment.urlMatch }, tabs => {
            callback(tabs && tabs[0].id);
        });
    }
}
exports.Tabs = Tabs;


/***/ }),
/* 3 */,
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_panel_interaction_1 = __webpack_require__(6);
const message_type_models_1 = __webpack_require__(0);
const messaging_1 = __webpack_require__(1);
const eventsPanelInteraction = new events_panel_interaction_1.EventsPanelInteraction();
//const messaging = new Messaging();
console.log('content-scripts initialized');
const messaging = new messaging_1.Messaging('content');
messaging.subscribe(message_type_models_1.MessageType.RunNextTrip, () => {
    window.alert('got RunNextTrip subscription');
});
messaging.subscribe(message_type_models_1.MessageType.TripsUpdated, () => {
    window.alert('got TripsUpdated subscription');
});


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class EventsPanelInteraction {
}
exports.EventsPanelInteraction = EventsPanelInteraction;


/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = {
    urlMatch: 'https://*.squarespace.com/*'
};


/***/ })
/******/ ]);