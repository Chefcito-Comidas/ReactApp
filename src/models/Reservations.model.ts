import { Venue } from "./venues.model";

export type ReservationData = {
    result:Reservation[]
    total:number
}

type User = {
    id: string;
    name:string;
    phone:string;
    times_assisted: number;
    times_expired: number;
}
export type Reservation = {
    id:string;
    user:User;
    venue:string;
    time:string;
    people:number;
    status:ReservationStatus;
    restaurant?:Venue
}

type ReservationStatus = {
    status:string;
}