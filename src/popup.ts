import { ConvertExports } from './convert-exports';
import { WpExport } from './models/wp-export.model';


window.onload = () => {
    let count = 0;

    const convertExports: ConvertExports = new ConvertExports();
    const queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        document.getElementById('time').innerText = new Date().toLocaleString();
    });

    chrome.browserAction.setBadgeText({ text: '' + count });
    document.getElementById('count-up').addEventListener('click', () => {
        chrome.browserAction.setBadgeText({ text: '' + count++ });
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
           });
        });
    });
}
