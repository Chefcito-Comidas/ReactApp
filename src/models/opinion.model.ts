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

export type Summerie = {
    text: string;
    date: string;
    venue: string;
}