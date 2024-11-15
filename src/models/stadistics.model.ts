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

export type UserStats = {
    user:string;
    total: number;
    canceled: number;
    expired: number;
    expired_alert: boolean;
    canceled_alert: boolean;
}