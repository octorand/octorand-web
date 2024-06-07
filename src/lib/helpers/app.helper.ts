import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var halfmoon: any;

@Injectable({ providedIn: 'root' })
export class AppHelper {

    app: Subject<any>;

    state: {
        initialised: boolean,
        account: string | null,
        wallet: string | null,
        addresses: Array<string>
    };

    constructor() {
        this.app = new Subject<any>();

        this.state = {
            initialised: false,
            account: null,
            wallet: null,
            addresses: [],
        };

        this.initCurrentUser();
        this.state.initialised = true;
    }

    /**
     * Set currently selected account
     *
     * @param account
     */
    setAccount(account: string) {
        localStorage.setItem('account', account);
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
     * Get default state
     */
    getDefaultState(): any {
        return this.state;
    }

    /**
     * Show success message
     *
     * @param message
     */
    showSuccess(message: string) {
        halfmoon.initStickyAlert({
            alertType: "alert-success",
            content: message
        });
    }

    /**
     * Show warning message
     *
     * @param message
     */
    showWarning(message: string) {
        halfmoon.initStickyAlert({
            alertType: "alert-secondary",
            content: message
        });
    }

    /**
     * Show error message
     *
     * @param message
     */
    showError(message: string) {
        halfmoon.initStickyAlert({
            alertType: "alert-danger",
            content: message
        });
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

        this.app.next({ ...this.state });
    }
}