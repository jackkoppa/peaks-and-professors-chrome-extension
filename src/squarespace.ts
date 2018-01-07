import { MessageType } from './messaging/message-type.models';
import { MessagingService} from './messaging/messaging.service';
import { StorageHelper } from './storage/storage.helper';

const messagingService = new MessagingService('content');

console.log('squarespace.js initialized');

messagingService.subscribe(MessageType.RunNextTrip, () => {
    window.alert('got RunNextTrip subscription');
});

messagingService.subscribe(MessageType.TripsUpdated, () => {
    window.alert('got TripsUpdated subscription');
    StorageHelper.getLocal(localStorage => console.log('got local storage in content-scripts:', localStorage));
})