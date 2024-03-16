import { Injectable } from '@angular/core';
import { LotteryAlgoModel, LotteryAlgoAccountModel, LotteryAlgoActionModel, LotteryAlgoPayoutModel, LotteryAlgoTicketModel } from '@app/play/models';
import { LotteryAlgoGameContract } from '@app/play/contracts';
import { environment } from '@environment';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class LotteryAlgoService {

    /**
     * Service definition
     */
    private definition: any = null;

    /**
     * Construct service
     */
    constructor() {
        this.definition = {
            id: 'lottery',
            name: 'Lottery',
            icon: 'fas fa-bowling-ball',
            color: '#1abc9c',
            route: 'play/games/lottery/algo',
            masterPercentage: 4,
            creationCost: 2000000,
            mainAppId: environment.play.apps.lottery.algo.main_app_id,
            mainAppAddress: environment.play.apps.lottery.algo.main_app_address,
            mainAppCreator: environment.play.apps.lottery.algo.main_app_creator,
            description: 'Lottery is a game of chance where winners are selected by a random drawing. Each ticket purchase contributes to the prize pool, which the winners share at the end of the game.'
        };
    }

    /**
     * Create lottery model from application state
     *
     * @param model
     * @param application
     */
    create(model: LotteryAlgoModel, application: any): LotteryAlgoModel {
        let id = application.id;
        let state = application['params']['global-state'];

        model.id = id;
        model.address = algosdk.getApplicationAddress(id);
        model.storage.load(state);

        return this.refresh(model);
    }

    /**
     * Refresh lottery model calculated parameters
     *
     * @param model
     */
    refresh(model: LotteryAlgoModel): LotteryAlgoModel {
        let currentTimestamp = Math.floor(Date.now() / 1000);
        let seconds = Math.max(model.storage.timer - currentTimestamp, 0);
        if (seconds == 0) {
            model.timespanLeft = '-';
            model.sortKey = model.storage.timer - currentTimestamp;

            if (model.storage.status == 3) {
                model.status = 'Archived';
            } else if (model.storage.status == 2) {
                model.status = 'Completed';
            } else if (model.storage.status == 1) {
                model.status = 'Finalising';
            } else if (model.storage.status == 0) {
                model.status = 'Finalising';
                if (model.storage.volume == 0) {
                    model.status = 'Completed';
                }
            }
        } else {
            model.timespanLeft = this.findTimespan(seconds);
            model.sortKey = Number.MAX_SAFE_INTEGER - (model.storage.timer - currentTimestamp);
            model.status = 'Running';
        }

        model.secondsLeft = seconds;

        return model;
    }

    /**
     * Create lottery models from application states
     *
     * @param applications
     */
    list(applications: Array<any>) {
        let models = [];

        for (let i = 0; i < applications.length; i++) {
            models.push(this.create(new LotteryAlgoModel(), applications[i]));
        }

        models.sort((first, second) => second.sortKey - first.sortKey);

        return models;
    }

    /**
     * Set lottery account model from application details
     *
     * @param model
     * @param application
     */
    setAccount(model: LotteryAlgoModel, application: any): LotteryAlgoModel {
        model.account = new LotteryAlgoAccountModel();

        model.account.address = application.address;
        if (application.states.length > 0) {
            model.account.opted = true;
            model.account.load(application.states[0]['key-value']);
        } else {
            model.account.opted = false;
            model.account.volume = 0;
        }

        if (model.storage.volume > 0) {
            model.account.percentage = model.account.volume * 100 / model.storage.volume;
        } else {
            model.account.percentage = 0;
        }

        let payout = 0;
        if (model.status == 'Completed') {
            if (model.account.address == model.storage.winner1) {
                payout = payout + model.storage.winnerPercentage1 * model.storage.volume / 100;
            }
            if (model.account.address == model.storage.winner2) {
                payout = payout + model.storage.winnerPercentage2 * model.storage.volume / 100;
            }
            if (model.account.address == model.storage.winner3) {
                payout = payout + model.storage.winnerPercentage3 * model.storage.volume / 100;
            }
        }

        model.account.payout = payout;

        return model;
    }

    /**
     * Set lottery action models from transaction details
     *
     * @param model
     * @param application
     */
    setActions(model: LotteryAlgoModel, transactions: Array<any>): LotteryAlgoModel {
        let gameContract = new algosdk.ABIContract(LotteryAlgoGameContract);
        let methodSignatures = [
            gameContract.methods.find((m: any) => { return m.name == 'play' }).getSelector(),
        ];

        let actions = [];
        for (let i = 0; i < transactions.length; i++) {
            let applicationTransaction = transactions[i]['application-transaction'];
            let applicationTransactionArgs = applicationTransaction['application-args'];
            if (applicationTransactionArgs.length > 0) {
                let methodArg = Buffer.from(applicationTransactionArgs[0], 'base64');
                if (this.isValidTransaction(methodArg, methodSignatures)) {
                    if (applicationTransactionArgs.length >= 2) {
                        let amountArg = applicationTransactionArgs[1];
                        let amount = Number(algosdk.decodeUint64(Buffer.from(amountArg, 'base64'), "bigint"));

                        let action = new LotteryAlgoActionModel();
                        action.id = transactions[i].id;
                        action.address = transactions[i].sender;
                        action.amount = amount;
                        action.timestamp = transactions[i]['round-time'];
                        actions.push(action);
                    }
                }
            }
        }

        model.actions = actions;

        return model;
    }

    /**
     * Set lottery payout models from model details
     *
     * @param model
     */
    setPayouts(model: LotteryAlgoModel): LotteryAlgoModel {
        let payouts = [];

        if (model.storage.winnerPercentage1 > 0) {
            let winnerPayout1 = new LotteryAlgoPayoutModel();
            winnerPayout1.payee = 'First winner prize';
            winnerPayout1.address = model.storage.winner1;
            winnerPayout1.percentage = model.storage.winnerPercentage1;
            winnerPayout1.amount = model.storage.winnerPercentage1 * model.storage.volume / 100;
            payouts.push(winnerPayout1);
        }

        if (model.storage.winnerPercentage2 > 0) {
            let winnerPayout2 = new LotteryAlgoPayoutModel();
            winnerPayout2.payee = 'Second winner prize';
            winnerPayout2.address = model.storage.winner2;
            winnerPayout2.percentage = model.storage.winnerPercentage2;
            winnerPayout2.amount = model.storage.winnerPercentage2 * model.storage.volume / 100;
            payouts.push(winnerPayout2);
        }

        if (model.storage.winnerPercentage3 > 0) {
            let winnerPayout3 = new LotteryAlgoPayoutModel();
            winnerPayout3.payee = 'Third winner prize';
            winnerPayout3.address = model.storage.winner3;
            winnerPayout3.percentage = model.storage.winnerPercentage3;
            winnerPayout3.amount = model.storage.winnerPercentage3 * model.storage.volume / 100;
            payouts.push(winnerPayout3);
        }

        let managerPayout = new LotteryAlgoPayoutModel();
        managerPayout.payee = 'Game manager fee';
        managerPayout.address = model.storage.manager;
        managerPayout.percentage = model.storage.managerPercentage;
        managerPayout.amount = model.storage.managerShare;
        payouts.push(managerPayout);

        let masterPayout = new LotteryAlgoPayoutModel();
        masterPayout.payee = 'Platform fee';
        masterPayout.address = model.storage.master;
        masterPayout.percentage = this.definition.masterPercentage;
        masterPayout.amount = model.storage.masterShare;
        payouts.push(masterPayout);

        model.payouts = payouts;

        return model;
    }

    /**
     * Set lottery ticket models from model details
     *
     * @param model
     */
    setTickets(model: LotteryAlgoModel): LotteryAlgoModel {
        let tickets: Array<LotteryAlgoTicketModel> = [];

        for (let i = 0; i < model.actions.length; i++) {
            let action = model.actions[i];

            let ticket = tickets.find(ticket => ticket.address == action.address);
            if (ticket) {
                ticket.amount = ticket.amount + action.amount;
            } else {
                ticket = new LotteryAlgoTicketModel();
                ticket.address = action.address;
                ticket.amount = action.amount;
                tickets.push(ticket);
            }
        }

        for (let i = 0; i < tickets.length; i++) {
            if (model.storage.volume > 0) {
                tickets[i].percentage = tickets[i].amount * 100 / model.storage.volume;
            } else {
                tickets[i].percentage = 0;
            }

            tickets[i].payout = 0;
            for (let j = 0; j < model.payouts.length; j++) {
                if (model.payouts[j].address == tickets[i].address) {
                    tickets[i].payout = tickets[i].payout + model.payouts[j].amount;
                }
            }
        }

        tickets.sort((first, second) => second.amount - first.amount);

        model.tickets = tickets;

        return model;
    }

    /**
     * Get service definition
     */
    getDefinition() {
        return this.definition;
    }

    /**
     * Find timespan text
     *
     * @param seconds
     */
    private findTimespan(seconds: number): string {
        let days = Math.floor(seconds / (3600 * 24));
        seconds -= days * 3600 * 24;

        let hours = Math.floor(seconds / 3600);
        seconds -= hours * 3600;

        let minutes = Math.floor(seconds / 60);
        seconds -= minutes * 60;

        let parts = [];

        (days) && parts.push(days + 'd');
        (days || hours) && parts.push(hours + 'h');
        (days || hours || minutes) && parts.push(minutes + 'm');

        parts.push(seconds + 's');

        return parts.join(' ');
    }

    /**
     * Check whether transaction is valid
     *
     * @param methodArg
     * @param methodSignatures
     */
    private isValidTransaction(methodArg: Uint8Array, methodSignatures: Array<Uint8Array>): boolean {
        let valid = false;
        for (let i = 0; i < methodSignatures.length; i++) {
            let first = methodArg;
            let second = methodSignatures[i];

            if (first.length === second.length && first.every((value, index) => value === second[index])) {
                valid = true;
                break;
            }
        }

        return valid;
    }
}