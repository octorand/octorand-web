import { Injectable } from '@angular/core';
import { PredictionAlgoModel, PredictionAlgoAccountModel, PredictionAlgoActionModel, PredictionAlgoPayoutModel, PredictionAlgoTicketModel } from '@app/play/models';
import { PredictionAlgoGameContract } from '@app/play/contracts';
import { environment } from '@environment';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class PredictionAlgoService {

    /**
     * Service definition
     */
    private definition: any = null;

    /**
     * Construct service
     */
    constructor() {
        this.definition = {
            id: 'prediction',
            name: 'Prediction',
            icon: 'fas fa-trophy',
            color: '#f1c40f',
            route: 'play/games/prediction/algo',
            masterPercentage: 4,
            creationCost: 2000000,
            mainAppId: environment.play.apps.prediction.algo.main_app_id,
            mainAppAddress: environment.play.apps.prediction.algo.main_app_address,
            mainAppCreator: environment.play.apps.prediction.algo.main_app_creator,
            description: 'Prediction games presents a number of options for the players to bet on. Each bet contributes to the prize pool. Players who bet on the winning option share the prize pool at the end of the game.'
        };
    }

    /**
     * Create prediction model from application state
     *
     * @param model
     * @param application
     */
    create(model: PredictionAlgoModel, application: any): PredictionAlgoModel {
        let id = application.id;
        let state = application['params']['global-state'];

        model.id = id;
        model.address = algosdk.getApplicationAddress(id);
        model.storage.load(state);

        return this.refresh(model);
    }

    /**
     * Refresh prediction model calculated parameters
     *
     * @param model
     */
    refresh(model: PredictionAlgoModel): PredictionAlgoModel {
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

        let winnerProfits = model.storage.volume * model.storage.winnerPercentage / 100;
        let winnerMultiplier = 1 + (model.storage.winnerPercentage / 100);
        if (model.storage.volume > 0) {
            model.odds1 = (model.storage.tickets1 > 0) ? (winnerProfits / model.storage.tickets1) : winnerMultiplier;
            model.odds2 = (model.storage.tickets2 > 0) ? (winnerProfits / model.storage.tickets2) : winnerMultiplier;
            model.odds3 = (model.storage.tickets3 > 0) ? (winnerProfits / model.storage.tickets3) : winnerMultiplier;
        } else {
            model.odds1 = winnerMultiplier;
            model.odds2 = winnerMultiplier;
            model.odds3 = winnerMultiplier;
        }

        return model;
    }

    /**
     * Create prediction models from application states
     *
     * @param applications
     */
    list(applications: Array<any>) {
        let models = [];

        for (let i = 0; i < applications.length; i++) {
            models.push(this.create(new PredictionAlgoModel(), applications[i]));
        }

        models.sort((first, second) => second.sortKey - first.sortKey);

        return models;
    }

    /**
     * Set prediction account model from application details
     *
     * @param model
     * @param application
     */
    setAccount(model: PredictionAlgoModel, application: any): PredictionAlgoModel {
        model.account = new PredictionAlgoAccountModel();

        model.account.address = application.address;
        if (application.states.length > 0) {
            model.account.opted = true;
            model.account.load(application.states[0]['key-value']);
        } else {
            model.account.opted = false;
            model.account.withdrawn = false;
            model.account.tickets1 = 0;
            model.account.tickets2 = 0;
            model.account.tickets3 = 0;
            model.account.volume = 0;
        }

        if (model.storage.tickets1 > 0) {
            model.account.percentage1 = model.account.tickets1 * 100 / model.storage.tickets1;
        } else {
            model.account.percentage1 = 0;
        }

        if (model.storage.tickets2 > 0) {
            model.account.percentage2 = model.account.tickets2 * 100 / model.storage.tickets2;
        } else {
            model.account.percentage2 = 0;
        }

        if (model.storage.tickets3 > 0) {
            model.account.percentage3 = model.account.tickets3 * 100 / model.storage.tickets3;
        } else {
            model.account.percentage3 = 0;
        }

        let winnerProfits = model.storage.volume * model.storage.winnerPercentage / 100;
        if (model.status == 'Completed' && !model.account.withdrawn) {
            if (model.storage.winner == 1 && model.storage.tickets1 > 0) {
                model.account.payout = winnerProfits * model.account.tickets1 / model.storage.tickets1;
            }
            if (model.storage.winner == 2 && model.storage.tickets2 > 0) {
                model.account.payout = winnerProfits * model.account.tickets2 / model.storage.tickets2;
            }
            if (model.storage.winner == 3 && model.storage.tickets3 > 0) {
                model.account.payout = winnerProfits * model.account.tickets3 / model.storage.tickets3;
            }
        }

        return model;
    }

    /**
     * Set prediction action models from transaction details
     *
     * @param model
     * @param application
     */
    setActions(model: PredictionAlgoModel, transactions: Array<any>): PredictionAlgoModel {
        let gameContract = new algosdk.ABIContract(PredictionAlgoGameContract);
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
                    if (applicationTransactionArgs.length >= 3) {
                        let optionArg = applicationTransactionArgs[1];
                        let option = Number(algosdk.decodeUint64(Buffer.from(optionArg, 'base64'), "bigint"));

                        let amountArg = applicationTransactionArgs[2];
                        let amount = Number(algosdk.decodeUint64(Buffer.from(amountArg, 'base64'), "bigint"));

                        let action = new PredictionAlgoActionModel();
                        action.id = transactions[i].id;
                        action.address = transactions[i].sender;
                        action.option = option;
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
     * Set prediction payout models from model details
     *
     * @param model
     */
    setPayouts(model: PredictionAlgoModel): PredictionAlgoModel {
        let payouts = [];

        if (model.storage.winnerPercentage > 0) {
            let winnerPayout = new PredictionAlgoPayoutModel();
            winnerPayout.payee = 'Prize pool';
            winnerPayout.address = '';
            winnerPayout.percentage = model.storage.winnerPercentage;
            winnerPayout.amount = model.storage.winnerPercentage * model.storage.volume / 100;
            winnerPayout.withdrawn = false;
            payouts.push(winnerPayout);
        }

        let managerPayout = new PredictionAlgoPayoutModel();
        managerPayout.payee = 'Game manager fee';
        managerPayout.address = model.storage.manager;
        managerPayout.percentage = model.storage.managerPercentage;
        managerPayout.amount = model.storage.managerShare;
        payouts.push(managerPayout);

        let masterPayout = new PredictionAlgoPayoutModel();
        masterPayout.payee = 'Platform fee';
        masterPayout.address = model.storage.master;
        masterPayout.percentage = this.definition.masterPercentage;
        masterPayout.amount = model.storage.masterShare;
        payouts.push(masterPayout);

        model.payouts = payouts;

        return model;
    }

    /**
     * Set prediction ticket models from model details
     *
     * @param model
     */
    setTickets(model: PredictionAlgoModel): PredictionAlgoModel {
        let tickets: Array<PredictionAlgoTicketModel> = [];

        for (let i = 0; i < model.actions.length; i++) {
            let action = model.actions[i];

            let ticket = tickets.find(ticket => ticket.address == action.address);
            if (ticket) {
                if (action.option == 1) {
                    ticket.amount1 = ticket.amount1 + action.amount;
                } else if (action.option == 2) {
                    ticket.amount2 = ticket.amount2 + action.amount;
                } else if (action.option == 3) {
                    ticket.amount3 = ticket.amount3 + action.amount;
                }
            } else {
                ticket = new PredictionAlgoTicketModel();
                ticket.address = action.address;

                if (action.option == 1) {
                    ticket.amount1 = action.amount;
                } else if (action.option == 2) {
                    ticket.amount2 = action.amount;
                } else if (action.option == 3) {
                    ticket.amount3 = action.amount;
                }

                tickets.push(ticket);
            }
        }

        let winnerProfits = model.storage.volume * model.storage.winnerPercentage / 100;

        for (let i = 0; i < tickets.length; i++) {
            if (model.storage.volume > 0) {
                tickets[i].percentage1 = tickets[i].amount1 * model.storage.tickets1 / model.storage.volume;
                tickets[i].percentage2 = tickets[i].amount2 * model.storage.tickets2 / model.storage.volume;
                tickets[i].percentage3 = tickets[i].amount3 * model.storage.tickets3 / model.storage.volume;
            } else {
                tickets[i].percentage1 = 0;
                tickets[i].percentage2 = 0;
                tickets[i].percentage3 = 0;
            }

            tickets[i].payout = 0;
            if (model.storage.winner == 1 && model.storage.tickets1 > 0) {
                tickets[i].payout = winnerProfits * tickets[i].amount1 / model.storage.tickets1;
            }
            if (model.storage.winner == 2 && model.storage.tickets2 > 0) {
                tickets[i].payout = winnerProfits * tickets[i].amount2 / model.storage.tickets2;
            }
            if (model.storage.winner == 3 && model.storage.tickets3 > 0) {
                tickets[i].payout = winnerProfits * tickets[i].amount3 / model.storage.tickets3;
            }
        }

        tickets.sort((first, second) => (second.amount1 + second.amount2 + second.amount3) - (first.amount1 + first.amount2 + first.amount3));

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