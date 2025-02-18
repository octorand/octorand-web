﻿import { Injectable } from '@angular/core';
import { environment } from '@environment';

@Injectable({ providedIn: 'root' })
export class WalletHelper {

    /**
     * List of wallets
     */
    private wallets = [
        {
            id: 'exodus',
            name: 'Exodus',
            color: '#8255a0',
            mainnet: true,
            testnet: false
        },
        {
            id: 'pera-wallet',
            name: 'Pera Wallet',
            color: '#f8ca44',
            mainnet: true,
            testnet: true
        },
        {
            id: 'defly-wallet',
            name: 'Defly Wallet',
            color: '#ffffff',
            mainnet: true,
            testnet: true
        }
    ];

    /**
     * Get a list of wallets
     */
    list() {
        if (environment.production) {
            return this.wallets.filter(w => w.mainnet);
        } else {
            return this.wallets.filter(w => w.testnet);
        }
    }
}