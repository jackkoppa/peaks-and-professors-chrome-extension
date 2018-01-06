import { TripRecord, TripRecordDetails } from './trip-record.models';
import { WpExport  } from './wp-export.model';

export class ConvertExports {
    private wpExports: WpExport[] = [];
    private tripRecords: TripRecord[] = [];
    public exportsToTripRecords(wpExports: WpExport[]): TripRecord[] {
        this.wpExports = wpExports;
        this.initializeTripRecords();
        this.addDetailsToRecords();
        return this.tripRecords;
    }

    private initializeTripRecords(): void {
        this.wpExports.forEach(wpExport => {
            if (!this.tripRecords.find(tripRecord => tripRecord.ID === wpExport.ID))
                this.tripRecords.push(this.newRecordFromExport(wpExport))
        });
    }

    private newRecordFromExport(wpExport: WpExport): TripRecord {
        return {
            ID: wpExport.ID,
            title: wpExport.post_title,
            imported: false,
            details: {}
        }
    }

    private addDetailsToRecords(): void {
        this.wpExports.forEach(wpExport => {
            this.addDetail(wpExport);
        });
    }

    private addDetail(wpExport: WpExport): void {
        const tripRecord = this.tripRecords.find(tripRecord => tripRecord.ID === wpExport.ID);
        this.validateNewDetail(wpExport, tripRecord);
        tripRecord.details[wpExport.meta_key] = wpExport.meta_value;
    }

    private validateNewDetail(wpExport: WpExport, tripRecord: TripRecord): void {
        const detailExists = tripRecord.details[wpExport.meta_key] != null;
        const detailsDoNotMatch = tripRecord.details[wpExport.meta_key] !== wpExport.meta_value;
        if (detailExists && detailsDoNotMatch)
            console.error(`duplicate '${wpExport.meta_key}' keys for trip ID ${tripRecord.ID},` +
             `with values '${tripRecord.details[wpExport.meta_key]}' & '${wpExport.meta_value}'`);
            //throw new Error (`duplicate '${wpExport.meta_key}' keys for trip ID ${tripRecord.ID}`);            
    }
}