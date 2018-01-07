import { EventsPanelInteraction } from './interaction/events-panel-interaction';
import { MessageType } from './messaging/message-type.models';
import { Messaging} from './messaging/messaging';

const eventsPanelInteraction = new EventsPanelInteraction();
//const messaging = new Messaging();

console.log('content-scripts initialized');

const messaging = new Messaging('content');

messaging.subscribe(MessageType.RunNextTrip, () => {
    window.alert('got RunNextTrip subscription');
});

messaging.subscribe(MessageType.TripsUpdated, () => {
    window.alert('got TripsUpdated subscription');
})