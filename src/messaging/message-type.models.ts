export interface Message {
    type: MessageType;
    value?: any;
}

export enum MessageType {
    TripsUpdated = 1,
    RunNextTrip
}

export type Origin = 'popup' | 'content';