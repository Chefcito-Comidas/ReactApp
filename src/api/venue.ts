import { User } from "firebase/auth";
import { apiGet,apiPost,apiPut } from "./apiRestWrapper";
import { Venue } from "../models/venues.model";

export const getVenue = async  (user:User,id:string) => {
    const token = await user.getIdToken()
    return apiGet<Venue>({url:`venue`,customHeaders:{Authorization:`Bearer ${token}`}})
}

export const CreateVenue = async (user:User,data:Partial<Venue>) =>{
    const token = await user.getIdToken()
    return apiPost<Venue>({url:`venues`,payload:{...data},customHeaders:{Authorization:`Bearer ${token}`}})
}

export const EditVenue = async (user:User,data:Partial<Venue>) => {
    const token = await user.getIdToken()
    return apiPut<Venue>({url:`venues?id=${data.id}`,payload:{...data,open:false,close:false,occupy:false},customHeaders:{Authorization:`Bearer ${token}`}})
}