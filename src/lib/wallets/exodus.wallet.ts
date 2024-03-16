import { Injectable } from '@angular/core';

declare var window: any;

@Injectable({ providedIn: 'root' })
export class ExodusWallet {

    /**
     * Sign group of transactions
     * 
     * @param transactions
     */
    async sign(transactions: Array<any>) {
        if (window && window.exodus && window.exodus.algorand) {
            try {
                let transactionsToSign = [];
                for (let i = 0; i < transactions.length; i++) {
                    transactionsToSign.push(transactions[i].toByte());
                }

                let signedTransactions = await window.exodus.algorand.signTransaction(transactionsToSign);

                let signed = [];
                for (let i = 0; i < signedTransactions.length; i++) {
                    if (signedTransactions[i]) {
                        signed.push(signedTransactions[i]);
                    }
                }

                return {
                    success: true,
                    message: '',
                    signed: signed
                };
            } catch (error) {
                console.log(error);
                return {
                    success: false,
                    message: 'Exodus is not connected.',
                    signed: []
                }
            }
        } else {
            return {
                success: false,
                message: 'Exodus is not installed.',
                signed: []
            }
        };
    }
}
