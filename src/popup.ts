import { ConversionService } from './conversion/conversion.service';
import { WpExport } from './conversion/wp-export.model';
import { PopupInteractionHelper } from './interaction/popup-interaction.helper';
import { MessageType } from './messaging/message-type.models';
import { MessagingService} from './messaging/messaging.service';   
import { StorageHelper } from './storage/storage.helper'; 
import { TripsHelper } from './trips/trips.helper';
import { TripRecord } from './conversion/trip-record.models';
import { LocalStorage } from './storage/local-storage.model';

const conversionService: ConversionService = new ConversionService();
const messagingService: MessagingService = new MessagingService('popup');

const setImportedAndRemainingLists = (localStorage: LocalStorage) => {
    const importedList = TripsHelper.list(localStorage.tripRecords, 'imported');
    const remainingList = TripsHelper.list(localStorage.tripRecords, 'remaining');

    PopupInteractionHelper.importedTextarea.value = importedList;
    PopupInteractionHelper.remainingTextarea.value = remainingList;
    if (remainingList && remainingList.length > 0) PopupInteractionHelper.startImportButton.disabled = false;
}

window.onload = () => {
    let count = 0;

    chrome.browserAction.setBadgeText({ text: '' + count });
    StorageHelper.getLocal(localStorage => setImportedAndRemainingLists(localStorage))

    PopupInteractionHelper.startImportButton.addEventListener('click', () => {
        console.log('clicked startImportButton');
        messagingService.send(MessageType.RunNextTrip);
    });

    PopupInteractionHelper.convertExportsButton.addEventListener('click', () => {
        const wpExportsVal = PopupInteractionHelper.wpExportsTextarea.value;
        const wpExports = wpExportsVal && JSON.parse(wpExportsVal) as WpExport[];
        const tripRecords = conversionService.exportsToTripRecords(wpExports);
        StorageHelper.setLocal({
            wpExports: wpExports,
            tripRecords: tripRecords
        }, () => {
            messagingService.send(MessageType.TripsUpdated);
            PopupInteractionHelper.wpExportsTextarea.disabled = true;
            PopupInteractionHelper.convertExportsButton.disabled = true;

            StorageHelper.getLocal(localStorage => setImportedAndRemainingLists(localStorage));
        });
    });
}
