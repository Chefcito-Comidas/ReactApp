import { Venue } from "./venues.model";

export type Reservation = {
    id:string;
    user:string;
    venue:string;
    time:string;
    people:number;
    status:ReservationStatus;
    restaurant?:Venue
}

type ReservationStatus = {
    status:string;
}