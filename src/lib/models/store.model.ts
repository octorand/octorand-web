export class StoreModel {

    initialised: boolean = false;
    account_gen: number = 1;
    account_sort: string = 'Id';
    account_badges: Array<string> = [];
    browse_gen: number = 1;
    browse_sort: string = 'Id';
    browse_badges: Array<string> = [];
    market_gen: number = 1;
    market_sort: string = 'Id';
    market_badges: Array<string> = [];
}