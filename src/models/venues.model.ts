export type Venue = {
    id?: string;
    name: string;
    location:string;
    capacity:number;
    logo: string;
    pictures: string[];
    slots: string[];
    status?: Status;
    characteristics:string[];
    vacations:string[];
    features:string[];
    reservationLeadTime:number;
    menu:string;
}

type Status = {
    status:string;
}
