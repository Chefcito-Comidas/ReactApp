export type Opinion = {
    venue: string;
    opinion: string;
    reservation: string;
    date: string;
}

export type OpinionRequest = {
    result:Opinion[];
    total:number;
}