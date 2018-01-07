import { TripRecord } from "../conversion/trip-record.models";

export class SquarespaceFlowService {
    constructor(
        private tripRecord: TripRecord
    ) { }

    public attemptImport(): Promise<string> {
        let results = new Promise<string>((resolve, reject) => {
            console.log('current trip from SquarespaceFlowService', this.tripRecord)
            resolve('it worked');
        });
        return results;
    }
}