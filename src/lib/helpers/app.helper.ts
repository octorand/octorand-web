import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IndexerHelper } from './indexer.helper';
import { AccountModel, AppModel } from '@lib/models';

const halfmoon = require("halfmoon");

@Injectable({ providedIn: 'root' })
export class AppHelper {

    /**
     * Observable subject
     */
    app: Subject<any>;

    /**
     * State of model
     */
    private state: AppModel;

    /**
     * Construct component
     *
     * @param indexerHelper
     */
    constructor(
        private indexerHelper: IndexerHelper
    ) {
        this.app = new Subject<any>();
        this.state = new AppModel();
        this.initCurrentUser();
        this.initTasks();
    }

    /**
     * Get default state
     */
    getDefaultState(): AppModel {
        return this.state;
    }

    /**
     * Initialize tasks
     */
    initTasks() {
        this.loadAccountDetails();
    }

    /**
     * Load account
     */
    loadAccountDetails() {
        if (this.state.account) {
            let promises = [
                this.indexerHelper.lookupAccount(this.state.account),
            ];

            Promise.all(promises).then(values => {
                let account = values[0];
                let assets = [];
                if (account['assets']) {
                    for (let i = 0; i < account['assets'].length; i++) {
                        assets.push({
                            id: account['assets'][i]['asset-id'],
                            amount: account['assets'][i]['amount']
                        });
                    }
                };

                this.state.assets = assets;
                this.app.next({ ...this.state });
            });
        } else {
            this.state.assets = [];
            this.app.next({ ...this.state });
        }
    }

    /**
     * Set currently selected account
     *
     * @param account
     */
    setAccount(account: string) {
        localStorage.setItem('account', account.toUpperCase());
        this.state.account = account;
        this.app.next({ ...this.state });
    }

    /**
     * Set currently selected wallet
     *
     * @param wallet
     */
    setWallet(wallet: string) {
        localStorage.setItem('wallet', wallet);
        this.state.wallet = wallet;
        this.app.next({ ...this.state });
    }

    /**
     * Set currently available accounts
     *
     * @param addresses
     */
    setAccounts(addresses: Array<string>) {
        let accounts: Array<AccountModel> = [];

        for (let i = 0; i < addresses.length; i++) {
            let account = new AccountModel();
            account.address = addresses[i].toUpperCase();
            account.private_key = null;
            account.public_key = null;
            account.token = null;
            accounts.push(account);
        }

        localStorage.setItem('accounts', JSON.stringify(accounts));

        this.state.accounts = accounts;
        this.app.next({ ...this.state });
    }

    /**
     * Get Current account
     */
    getAccount(): string | null {
        return this.state.account;
    }

    /**
     * Get Current wallet
     */
    getWallet(): string | null {
        return this.state.wallet;
    }

    /**
     * Refresh interface
     */
    refreshInterface() {
        try {
            halfmoon.onDOMContentLoaded();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Toggle sidebar
     */
    toggleSidebar() {
        try {
            halfmoon.toggleSidebar();
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Show success message
     *
     * @param message
     */
    showSuccess(message: string) {
        try {
            halfmoon.initStickyAlert({
                alertType: "alert-success",
                content: message
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Show warning message
     *
     * @param message
     */
    showWarning(message: string) {
        try {
            halfmoon.initStickyAlert({
                alertType: "alert-secondary",
                content: message
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Show error message
     *
     * @param message
     */
    showError(message: string) {
        try {
            halfmoon.initStickyAlert({
                alertType: "alert-danger",
                content: message
            });
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Initialise current user details
     */
    private initCurrentUser() {
        let account = localStorage.getItem('account');
        let wallet = localStorage.getItem('wallet');
        let accounts = localStorage.getItem('accounts');

        this.state.account = account;
        this.state.wallet = wallet;

        if (accounts) {
            let results: Array<AccountModel> = [];

            let values = [];
            try {
                let saved = JSON.parse(accounts);
                if (saved && Array.isArray(saved)) {
                    values = saved;
                }
            } catch (error) { }

            for (let i = 0; i < values.length; i++) {
                let account = new AccountModel();
                account.address = values[i].address;
                account.private_key = values[i].private_key;
                account.public_key = values[i].public_key;
                account.token = values[i].token;
                results.push(account);
            }

            this.state.accounts = results;
        } else {
            this.state.accounts = [];
        }

        this.state.initialised = true;

        this.app.next({ ...this.state });
    }
}