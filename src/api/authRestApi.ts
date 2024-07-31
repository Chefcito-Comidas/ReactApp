import { UserPost } from "../models/user.model"
import { apiPost,apiGet } from "./apiRestWrapper"

export const CreateUser = async (token:string): Promise<UserPost> => {
    return apiPost<UserPost>({ url: `users`,payload:{user_type: "restaurant"},customHeaders:{Authorization:`Bearer ${token}`} })
}

export const SingInUser = async (token:string): Promise<UserPost> => {
    return apiGet<UserPost>({ url: `users`,customHeaders:{Authorization:`Bearer ${token}`} })
}