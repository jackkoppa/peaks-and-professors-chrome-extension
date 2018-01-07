import { MessagingService } from "./messaging/messaging.service";
import { MessageType } from "./messaging/message-type.models";

console.log('initialized background');

const messagingService: MessagingService = new MessagingService('background');

messagingService.subscribe(MessageType.SuccessfulTripImport, () => {
    console.log('background received successful trip import')
});

messagingService.subscribe(MessageType.FailedTripImport, () => {
    console.log('background received failed trip import')
});