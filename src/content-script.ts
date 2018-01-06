import { EventsPanelInteraction } from './interaction/events-panel-interaction';
import { MessageType } from './messaging/message-type.models';
import { Messaging} from './messaging/messaging';

const eventsPanelInteraction = new EventsPanelInteraction();
//const messaging = new Messaging();

console.log('content-scripts initialized');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('content-scripts received a message', message);
    window.alert('content-scripts received a message');
})



// chrome.runtime.onConnect.addListener(port => {
//     if (port.name === 'trips') {
//         port.onMessage.addListener(message => {
//             console.log('received message in content from popup:', message);
//         });
//     }
//     else port.disconnect();
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     console.log('got message from content-scripts that looks like:', message);
//     if (message[MessageType.TripsUpdated]) {
//         chrome.storage.local.get(items => {
//             window.alert(`Got the message! Here's the title of the first trip record: ${items.tripRecords[0].post_title}`);        
//         });  
//     }
// });

// messaging.subscribe(MessageType.TripsUpdated, () => {
//     chrome.storage.local.get(items => {
//         window.alert(`Got the message! Here's the title of the first trip record: ${items.tripRecords[0].post_title}`);        
//     });    
// });