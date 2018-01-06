export interface TripRecord {
    ID: number;
    title: string;
    imported: boolean;
    details: TripRecordDetails;
}

export interface TripRecordDetails {
    earth_event_startdate?: any;
    earth_event_enddate?: any;
    earth_event_start_time?: any;
    earth_event_end_time?: any;
    earth_event_description?: any;

    earth_peak_name?: any;
    earth_peak_difficulty?: any;
    earth_peak_scenery?: any;
    earth_peak_fact?: any;

    earth_professor_name?: any;
    earth_professor_department?: any;
    earth_professor_page_link?: any;
    earth_professor_quote?: any;
    earth_professor_quote_link?: any;

    professor_headshot?: any;
    provided_items?: any;
    necessary_items?: any;
    lead_post_object?: any;
    professor_website?: any;
    all_trails?: any;
    overnight_boolean?: any;
    standard_eventspot?: any;
    driver_eventspot?: any;
    waitlist_eventspot?: any;
}