import * as $ from 'jquery';

import { ConvertExports } from './convert-exports';
import { WpExport } from './models/wp-export.model';

let count = 0;

$(function () {
    const convertExports: ConvertExports = new ConvertExports();
    const queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        $('#url').text(tabs[0].url);
        $('#time').text(new Date().toLocaleString());
    });

    chrome.browserAction.setBadgeText({ text: '' + count });
    $('#countUp').click(() => {
        chrome.browserAction.setBadgeText({ text: '' + count++ });
    });

    $('#changeBackground').click(() => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                color: '#555555'
            },
                function (msg) {
                    console.log("result message:", msg);
                });
        });
    });

    $('#convert-exports').click(() => {
        const wpExports = JSON.parse($('#wp-exports').val() as string) as WpExport[];
        const tripRecords = convertExports.exportsToTripRecords(wpExports);
        chrome.storage.local.set({
            wpExports: wpExports,
            tripRecords: tripRecords
        }, () => {
           chrome.storage.local.get(items => {
               console.log(items.tripRecords);
           });
        });
    });
});
