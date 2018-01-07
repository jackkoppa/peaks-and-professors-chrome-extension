import { MessageType } from './messaging/message-type.models';
import { MessagingService} from './messaging/messaging.service';
import { StorageHelper } from './storage/storage.helper';
import { SquarespaceFlowService } from './interaction/squarespace-flow.service';
import { TripsHelper } from './trips/trips.helper';

const messagingService = new MessagingService('content');
let squarespaceFlowService: SquarespaceFlowService;
console.log('squarespace.js initialized');

messagingService.subscribe(MessageType.RunNextTrip, () => {
    console.log('got RunNextTrip subscription');    
    StorageHelper.getLocal(localStorage => {
        squarespaceFlowService = new SquarespaceFlowService(TripsHelper.getNextForImport(localStorage.tripRecords));
        squarespaceFlowService.attemptImport()
            .then(result => {
                console.log('successfully imported in squarespace, with result:', result)
                messagingService.send(MessageType.SuccessfulTripImport, result)
            }, error => {
                console.log('failed to import in squarespace, with error:', error)
                messagingService.send(MessageType.FailedTripImport, error)
            });
    });
});

messagingService.subscribe(MessageType.TripsUpdated, () => {
    console.log('got TripsUpdated subscription');
    StorageHelper.getLocal(localStorage => console.log('got local storage in content-scripts:', localStorage));
})