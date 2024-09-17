import { UserPost } from "../models/user.model"
import { apiPost,apiGet } from "./apiRestWrapper"

export const CreateUser = async (token:string,name:string,number:string): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "restaurant",user_name:name,user_number:number},customHeaders:{Authorization:`Bearer ${token}`} })
}

export const SingInUser = async (token:string): Promise<UserPost> => {
    return apiGet<UserPost>({ url: `users`,customHeaders:{Authorization:`Bearer ${token}`} })
}