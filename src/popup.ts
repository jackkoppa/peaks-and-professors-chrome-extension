import { ConvertExports } from './conversion/convert-exports';
import { MessageType } from './messaging/message-type.models';
import { Messaging} from './messaging/messaging';    
import { WpExport } from './conversion/wp-export.model';


window.onload = () => {
    let count = 0;

    const convertExports: ConvertExports = new ConvertExports();
    //const messaging: Messaging = new Messaging();
    const queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.runtime.connect();

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log('got message from popup');
    })

    chrome.tabs.query(queryInfo, function (tabs) {
        document.getElementById('time').innerText = new Date().toLocaleString();
    });

    chrome.browserAction.setBadgeText({ text: '' + count });
    document.getElementById('count-up').addEventListener('click', () => {
        chrome.browserAction.setBadgeText({ text: '' + count++ });
        chrome.runtime.sendMessage(MessageType.TripsUpdated);
    });

    document.getElementById('convert-exports').addEventListener('click', () => {
        const wpExportsVal = (document.getElementById('wp-exports') as HTMLTextAreaElement).value;
        const wpExports = JSON.parse(wpExportsVal) as WpExport[];
        const tripRecords = convertExports.exportsToTripRecords(wpExports);
        chrome.storage.local.set({
            wpExports: wpExports,
            tripRecords: tripRecords
        }, () => {
           chrome.storage.local.get(items => {
               console.log(items.tripRecords);
               chrome.tabs.query({},(results => {
                   const tab = results.find(tab => new RegExp(/Peaks.*Professors/).test(tab.title));

                   chrome.tabs.sendMessage(tab.id, 'sample message from popup to ' + tab.title);
               }))
           });
        });
    });
}
