export type Venue = {
    id?: string;
    name: string;
    location:string;
    capacity:number;
    logo: string;
    pictures: string[];
    slots: string[];
    status?: Status;
}

type Status = {
    status:string;
}

export type VenuePost = {
    name: string;
    location:string;
    capacity:number;
    logo: string;
    pictures: string[];
    slots: string[];
}