import { Injectable } from '@angular/core';
import { AppModel } from '../models/app.model';
import { IndexerHelper } from './indexer.helper';
import { Subject } from 'rxjs';

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

        this.state = {
            initialised: false,
            account: null,
            wallet: null,
            addresses: [],
            assets: [],
        };

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
     * Set currently available addresses
     *
     * @param wallet
     */
    setAddresses(addresses: Array<string>) {
        for (let i = 0; i < addresses.length; i++) {
            addresses[i] = addresses[i].toUpperCase();
        }

        localStorage.setItem('addresses', addresses.join(','));
        this.state.addresses = addresses;
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
        let addresses = localStorage.getItem('addresses');

        this.state.account = account;
        this.state.wallet = wallet;

        if (addresses) {
            this.state.addresses = addresses.split(',');
        } else {
            this.state.addresses = [];
        }

        this.state.initialised = true;

        this.app.next({ ...this.state });
    }
}