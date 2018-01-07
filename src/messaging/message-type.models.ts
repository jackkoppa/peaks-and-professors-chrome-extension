export interface Message {
    type: MessageType;
    value?: any;
}

export enum MessageType {
    TripsUpdated = 1,
    RunNextTrip,
    SuccessfulTripImport,
    FailedTripImport
}

export type Origin = 'popup' | 'background' | 'content';