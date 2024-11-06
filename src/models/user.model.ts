export type UserPost = {
    data:Data;
    points:Points;


    description?:string;
    endpoint?:string;
}

export type Data = {
    localid: string;
    email: string;
    name: string;
    phone_number: "string"
}

export type Points = {
    user: string;
    total: number,
    level: string;
} 
