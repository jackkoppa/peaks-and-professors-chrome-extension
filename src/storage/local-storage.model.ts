import { TripRecord } from '../conversion/trip-record.models';
import { WpExport } from '../conversion/wp-export.model';

export interface LocalStorage {
    tripRecords?: TripRecord[];
    wpExports?: WpExport[];
}