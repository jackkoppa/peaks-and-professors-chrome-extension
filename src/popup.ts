import { ConvertExportsService } from './conversion/convert-exports.service';
import { MessageType } from './messaging/message-type.models';
import { MessagingService} from './messaging/messaging.service';   
import { StorageHelper } from './storage/storage.helper'; 
import { WpExport } from './conversion/wp-export.model';


window.onload = () => {
    let count = 0;

    const convertExports: ConvertExportsService = new ConvertExportsService();
    const messagingService: MessagingService = new MessagingService('popup');

    chrome.browserAction.setBadgeText({ text: '' + count });
    document.getElementById('count-up').addEventListener('click', () => {
        chrome.browserAction.setBadgeText({ text: '' + count++ });
        messagingService.send(MessageType.RunNextTrip);
    });

    document.getElementById('convert-exports').addEventListener('click', () => {
        const wpExportsVal = (document.getElementById('wp-exports') as HTMLTextAreaElement).value;
        const wpExports = wpExportsVal && JSON.parse(wpExportsVal) as WpExport[];
        const tripRecords = convertExports.exportsToTripRecords(wpExports);
        StorageHelper.setLocal({
            wpExports: wpExports,
            tripRecords: tripRecords
        }, () => messagingService.send(MessageType.TripsUpdated));
    });

    
}
