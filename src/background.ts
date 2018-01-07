import { MessagingService } from "./messaging/messaging.service";
import { MessageType, Message } from "./messaging/message-type.models";
import { TripsHelper } from "./trips/trips.helper";
import { StorageHelper } from "./storage/storage.helper";

console.log('initialized background');

const messagingService: MessagingService = new MessagingService('background');

messagingService.subscribe(MessageType.SuccessfulTripImport, (message: Message) => {
    StorageHelper.getLocal(localStorage => {
        const tripRecords = localStorage.tripRecords;
        const modifiedTrip = tripRecords.find(tripRecord => tripRecord.ID === message.value);
        if (modifiedTrip) {
            modifiedTrip.imported = true;
            tripRecords.map(tripRecord => tripRecord.ID === modifiedTrip.ID ? modifiedTrip : tripRecord);
            StorageHelper.setLocal({
                tripRecords: tripRecords
            }, () => {
                console.log('Successfully imported trip!');
            })
        }        
    })
    console.log('background received successful trip import')
});

messagingService.subscribe(MessageType.FailedTripImport, (message: Message) => {
    console.log('background received failed trip import');
    window.alert(`Failed to import trip. Error: ${message.value}`)
});