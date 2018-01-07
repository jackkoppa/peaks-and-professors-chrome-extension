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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const convert_exports_1 = __webpack_require__(4);
const message_type_models_1 = __webpack_require__(0);
const messaging_1 = __webpack_require__(1);
window.onload = () => {
    let count = 0;
    const convertExports = new convert_exports_1.ConvertExports();
    const messaging = new messaging_1.Messaging('popup');
    const queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.runtime.connect();
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('got message from popup');
    });
    chrome.tabs.query(queryInfo, function (tabs) {
        document.getElementById('time').innerText = new Date().toLocaleString();
    });
    chrome.browserAction.setBadgeText({ text: '' + count });
    document.getElementById('count-up').addEventListener('click', () => {
        chrome.browserAction.setBadgeText({ text: '' + count++ });
        messaging.send(message_type_models_1.MessageType.RunNextTrip);
    });
    document.getElementById('convert-exports').addEventListener('click', () => {
        const wpExportsVal = document.getElementById('wp-exports').value;
        const wpExports = JSON.parse(wpExportsVal);
        const tripRecords = convertExports.exportsToTripRecords(wpExports);
        chrome.storage.local.set({
            wpExports: wpExports,
            tripRecords: tripRecords
        }, () => {
            chrome.storage.local.get(items => {
                console.log(items.tripRecords);
                messaging.send(message_type_models_1.MessageType.TripsUpdated);
            });
        });
    });
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class ConvertExports {
    constructor() {
        this.wpExports = [];
        this.tripRecords = [];
    }
    exportsToTripRecords(wpExports) {
        this.wpExports = wpExports;
        this.initializeTripRecords();
        this.addDetailsToRecords();
        return this.tripRecords;
    }
    initializeTripRecords() {
        this.wpExports.forEach(wpExport => {
            if (!this.tripRecords.find(tripRecord => tripRecord.ID === wpExport.ID))
                this.tripRecords.push(this.newRecordFromExport(wpExport));
        });
    }
    newRecordFromExport(wpExport) {
        return {
            ID: wpExport.ID,
            title: wpExport.post_title,
            imported: false,
            details: {}
        };
    }
    addDetailsToRecords() {
        this.wpExports.forEach(wpExport => {
            this.addDetail(wpExport);
        });
    }
    addDetail(wpExport) {
        const tripRecord = this.tripRecords.find(tripRecord => tripRecord.ID === wpExport.ID);
        this.validateNewDetail(wpExport, tripRecord);
        tripRecord.details[wpExport.meta_key] = wpExport.meta_value;
    }
    validateNewDetail(wpExport, tripRecord) {
        const detailExists = tripRecord.details[wpExport.meta_key] != null;
        const detailsDoNotMatch = tripRecord.details[wpExport.meta_key] !== wpExport.meta_value;
        if (detailExists && detailsDoNotMatch)
            console.error(`duplicate '${wpExport.meta_key}' keys for trip ID ${tripRecord.ID},` +
                `with values '${tripRecord.details[wpExport.meta_key]}' & '${wpExport.meta_value}'`);
        //throw new Error (`duplicate '${wpExport.meta_key}' keys for trip ID ${tripRecord.ID}`);            
    }
}
exports.ConvertExports = ConvertExports;


/***/ }),
/* 5 */,
/* 6 */,
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