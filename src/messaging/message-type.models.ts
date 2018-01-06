export enum MessageType {
    TripsUpdated = 1,
    RunNextTrip
}

export enum PortName {
    Trips = 1
}

export type Origin = 'popup' | 'content';