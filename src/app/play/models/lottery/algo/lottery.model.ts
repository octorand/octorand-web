import { LotteryAlgoAccountModel } from "./lottery-account.model";
import { LotteryAlgoActionModel } from "./lottery-action.model";
import { LotteryAlgoPayoutModel } from "./lottery-payout.model";
import { LotteryAlgoStorageModel } from "./lottery-storage.model";
import { LotteryAlgoTicketModel } from "./lottery-ticket.model";

export class LotteryAlgoModel {
    id: number = 0;
    address: string = '';
    status: string = '';
    assetId: number = 0;
    secondsLeft: number = 0;
    timespanLeft: string = '';
    sortKey: number = 0;
    storage: LotteryAlgoStorageModel = new LotteryAlgoStorageModel();
    account: LotteryAlgoAccountModel = new LotteryAlgoAccountModel();
    actions: Array<LotteryAlgoActionModel> = [];
    payouts: Array<LotteryAlgoPayoutModel> = [];
    tickets: Array<LotteryAlgoTicketModel> = [];
}