import { User } from "firebase/auth";
import { apiGet,apiPost,apiPut } from "./apiRestWrapper";
import { Venue,VenuePost } from "../models/venues.model";

export const getVenue = async  (user:User,id:string) => {
    const token = await user.getIdToken()
    return apiGet<Venue[]>({url:`venues?id=${id}`,customHeaders:{Authorization:`Bearer ${token}`}})
}

export const CreateVenue = async (user:User,data:VenuePost) =>{
    const token = await user.getIdToken()
    return apiPost<Venue>({url:`venues`,payload:{...data},customHeaders:{Authorization:`Bearer ${token}`}})
}

export const EditVenue = async (user:User,id:string,data:VenuePost) => {
    const token = await user.getIdToken()
    return apiPut<Venue>({url:`venues?id=${id}`,payload:{...data,open:false,close:false,occupy:false},customHeaders:{Authorization:`Bearer ${token}`}})
}