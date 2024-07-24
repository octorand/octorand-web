export class AppModel {
    initialised: boolean = false
    account: string | null = null;
    wallet: string | null = null;
    addresses: Array<string> = [];
    assets: Array<any> = [];
}