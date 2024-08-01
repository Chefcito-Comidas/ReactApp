import { User } from "firebase/auth";
import { apiGet, apiPut } from "./apiRestWrapper";
import { Reservation } from "../models/Reservations.model";

export class GetReservationProps {
    id?:string;
    status?:string;
    venue?:string;
    from_time?:string;
    to_time?:string;
    from_people?:number;
    to_people?:number;
    limit?:number = 10;
    start?:number = 0;
}

export const GetReservations = async (props:GetReservationProps,user:User):Promise<Reservation[]> => {
    const token = await user.getIdToken()
    let reqProps = ''
    if(props.id) reqProps += `&id=${props.id}`;
    if(props.status) reqProps += `&status=${props.status}`;
    if(props.venue) reqProps += `&venue=${props.venue}`;
    if(props.from_time) reqProps += `&from_time=${props.from_time}`;
    if(props.to_time) reqProps += `&to_time=${props.to_time}`;
    if(props.from_people) reqProps += `&from_people=${props.from_people}`;
    if(props.to_people) reqProps += `&to_people=${props.to_people}`;
    if(props.limit) reqProps += `&limit=${props.limit}`;
    if(props.start) reqProps += `&start=${props.start}`;
    return apiGet<any>({ url: `reservations?${reqProps}`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const CancelBooking = async (reservation:Reservation,user:User) => {
    const token = await user.getIdToken()
    const value = {
        accept:false,
        cancel:true,
        time:reservation.time,
        people:reservation.people
    }
    return apiPut<any>({ url: `reservations/${reservation.id}`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const AcceptBooking = async (reservation:Reservation,user:User) => {
    const token = await user.getIdToken()
    const value = {
        accept:true,
        cancel:false,
        time:reservation.time,
        people:reservation.people
    }
    return apiPut<any>({ url: `reservations/${reservation.id}`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}