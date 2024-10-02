import { User } from "firebase/auth";
import { apiGet, apiPut } from "./apiRestWrapper";
import { Reservation, ReservationData } from "../models/Reservations.model";

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

export const GetReservations = async (props:GetReservationProps,user:User):Promise<ReservationData> => {
    const token = await user.getIdToken()
    let reqProps = ''
    reqProps += `start=${props.start}`;
    if(props.limit) reqProps += `&limit=${props.limit}`;
    if(props.from_time) reqProps += `&from_time=${props.from_time}`;
    if(props.to_time) reqProps += `&to_time=${props.to_time}`;
    return apiGet<any>({ url: `reservations/venue?${reqProps}`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const CancelBooking = async (reservation:Reservation,user:User) => {
    const token = await user.getIdToken()
    const value = {
        cancel:true,
    }
    return apiPut<any>({ url: `reservations/${reservation.id}`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const AcceptBooking = async (reservation:Reservation,user:User) => {
    const token = await user.getIdToken()
    const value = {
        advance_forward:true,
    }
    return apiPut<any>({ url: `reservations/${reservation.id}`,payload:value,customHeaders:{Authorization:`Bearer ${token}`} })
}