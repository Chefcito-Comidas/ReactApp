import { User } from "firebase/auth";
import { apiGet, apiPost } from "./apiRestWrapper";
import { OpinionRequest, Summerie } from "../models/opinion.model";

export class GetOpinonProps {
    venue?:string;
    from_date?:string;
    to_date?:string;
    limit?:number = 10;
    start?:number = 0;
}

export const getOpinonsApi = async (props:GetOpinonProps,user:User):Promise<OpinionRequest> => {
    const token = await user.getIdToken()
    let reqProps = ''
    reqProps = `&start=${props.start}`;
    if(props.limit) reqProps += `&limit=${props.limit}`;
    if(props.venue) reqProps += `&venue=${props.venue}`;
    if(props.from_date) reqProps += `&from_date=${props.from_date}`;
    if(props.to_date) reqProps += `&to_date=${props.to_date}`;
    return apiGet<OpinionRequest>({ url: `opinions?${reqProps}`,customHeaders:{Authorization:`Bearer ${token}`} })
} 

export const getSummarieApi = async (id:string,user:User):Promise<Summerie> => {
    const token = await user.getIdToken()
    return apiGet<Summerie>({ url: `summaries/${id}`,customHeaders:{Authorization:`Bearer ${token}`} })
}

export const createSummary = async (id:string,user:User):Promise<Summerie> => {
    const token = await user.getIdToken()
    return apiPost<Summerie>({ url: `summaries/${id}`,payload:{},customHeaders:{Authorization:`Bearer ${token}`} })
}