import { AccountModel } from "./account.model";

export class AppModel {
    initialised: boolean = false;
    account: string | null = null;
    wallet: string | null = null;
    accounts: Array<AccountModel> = [];
    assets: Array<any> = [];
}