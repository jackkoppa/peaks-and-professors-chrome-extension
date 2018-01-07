import { TripRecord } from '../conversion/trip-record.models';

export class TripsHelper {
    // removing methods for now, since they're simple enough to rewrite

    static list(tripRecords: TripRecord[], status: 'imported' | 'remaining'): string {
        return tripRecords && tripRecords
            .filter(tripRecord => (status === 'imported') === tripRecord.imported)
            .map(tripRecord => `ID ${tripRecord.ID} - ${tripRecord.title}`)
            .join('\n');
    }

    static getNextForImport(tripRecords: TripRecord[]): TripRecord {
        return tripRecords && tripRecords.find(tripRecord => !tripRecord.imported)
    }
}