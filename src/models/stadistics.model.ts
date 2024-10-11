export type StadisticsModel = {
    venue: string;
    total: number;
    canceled: number;
    expired: number;
    people: number;
    days: {
        means: any
    };
    turns: {
        turns: any
    }
}