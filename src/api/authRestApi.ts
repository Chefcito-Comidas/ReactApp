import { UserPost,Data } from "../models/user.model"
import { apiPost,apiGet } from "./apiRestWrapper"

export const CreateUser = async (token:string,name:string,number:string): Promise<Data> => {
    return apiPost<Data>({ url: `users`,payload:{user_type: "restaurant",name:name,number:number},customHeaders:{Authorization:`Bearer ${token}`} })
}

export const SingInUser = async (token:string): Promise<UserPost> => {
    return apiGet<UserPost>({ url: `users`,customHeaders:{Authorization:`Bearer ${token}`} })
}