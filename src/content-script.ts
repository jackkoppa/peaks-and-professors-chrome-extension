import { EventsPanelInteraction } from './interaction/events-panel-interaction';
import { MessageType } from './messaging/message-type.models';
import { MessagingService} from './messaging/messaging.service';

const eventsPanelInteraction = new EventsPanelInteraction();
//const messaging = new Messaging();

console.log('content-scripts initialized');

const messagingService = new MessagingService('content');

messagingService.subscribe(MessageType.RunNextTrip, () => {
    window.alert('got RunNextTrip subscription');
});

messagingService.subscribe(MessageType.TripsUpdated, () => {
    window.alert('got TripsUpdated subscription');
})