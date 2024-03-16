import { PredictionAlgoAccountModel } from "./prediction-account.model";
import { PredictionAlgoActionModel } from "./prediction-action.model";
import { PredictionAlgoPayoutModel } from "./prediction-payout.model";
import { PredictionAlgoStorageModel } from "./prediction-storage.model";
import { PredictionAlgoTicketModel } from "./prediction-ticket.model";

export class PredictionAlgoModel {
    id: number = 0;
    address: string = '';
    status: string = '';
    assetId: number = 0;
    secondsLeft: number = 0;
    timespanLeft: string = '';
    sortKey: number = 0;
    odds1: number = 0;
    odds2: number = 0;
    odds3: number = 0;
    storage: PredictionAlgoStorageModel = new PredictionAlgoStorageModel();
    account: PredictionAlgoAccountModel = new PredictionAlgoAccountModel();
    actions: Array<PredictionAlgoActionModel> = [];
    payouts: Array<PredictionAlgoPayoutModel> = [];
    tickets: Array<PredictionAlgoTicketModel> = [];
}