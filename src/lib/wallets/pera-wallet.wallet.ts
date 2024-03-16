import { Injectable } from '@angular/core';
import { PeraWalletConnect } from "@perawallet/connect";

@Injectable({ providedIn: 'root' })
export class PeraWalletWallet {

    /**
     * Sign group of transactions
     * 
     * @param transactions
     */
    async sign(transactions: Array<any>) {
        try {
            let peraConnection = new PeraWalletConnect({
                shouldShowSignTxnToast: false
            });

            await peraConnection.reconnectSession();

            let transactionsToSign = [];
            for (let i = 0; i < transactions.length; i++) {

                transactionsToSign.push({ txn: transactions[i] });
            }

            let signedTransactions = await peraConnection.signTransaction([transactionsToSign]);

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
                message: 'Pera wallet is not connected.',
                signed: []
            }
        }
    }
}
