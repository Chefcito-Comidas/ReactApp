import { User } from "firebase/auth";
import { apiGet } from "./apiRestWrapper";
import { StadisticsModel,UserStats } from "../models/stadistics.model";


export const getStadistics = async (id:string,user:User):Promise<StadisticsModel> => {
    const token = await user.getIdToken()
    return apiGet<StadisticsModel>({ url: `stats/venue/${id}`,customHeaders:{Authorization:`Bearer ${token}`} })
} 

export const getUSerStadistics = async (id:string,user:User):Promise<UserStats> => {
    const token = await user.getIdToken()
    return apiGet<UserStats>({ url: `stats/user/${id}`,customHeaders:{Authorization:`Bearer ${token}`} })
} 