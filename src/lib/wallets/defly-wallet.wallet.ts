import { Injectable } from '@angular/core';
import { DeflyWalletConnect } from "@blockshake/defly-connect";

@Injectable({ providedIn: 'root' })
export class DeflyWalletWallet {

    /**
     * Sign group of transactions
     *
     * @param transactions
     */
    async sign(transactions: Array<any>) {
        try {
            let deflyConnection = new DeflyWalletConnect({
                shouldShowSignTxnToast: false
            });

            await deflyConnection.reconnectSession();

            let transactionsToSign = [];
            for (let i = 0; i < transactions.length; i++) {

                transactionsToSign.push({ txn: transactions[i] });
            }

            let signedTransactions = await deflyConnection.signTransaction([transactionsToSign]);

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
                message: 'Defly wallet is not connected.',
                signed: []
            }
        }
    }
}
