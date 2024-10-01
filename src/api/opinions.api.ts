import { User } from "firebase/auth";
import { apiGet } from "./apiRestWrapper";
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
    if(props.limit) reqProps += `&limit=${props.limit}`;
    if(props.start) reqProps += `&start=${props.start}`;
    if(props.venue) reqProps += `&venue=${props.start}`;
    if(props.from_date) reqProps += `&from_date=${props.start}`;
    if(props.to_date) reqProps += `&to_date=${props.start}`;
    return apiGet<OpinionRequest>({ url: `opinions?${reqProps}`,customHeaders:{Authorization:`Bearer ${token}`} })
} 

export const getSummarieApi = async (id:string,user:User):Promise<Summerie> => {
    const token = await user.getIdToken()
    return apiGet<Summerie>({ url: `summaries/${id}`,customHeaders:{Authorization:`Bearer ${token}`} })
}