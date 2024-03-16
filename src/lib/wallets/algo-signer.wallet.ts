import { Injectable } from '@angular/core';

declare var AlgoSigner: any;

@Injectable({ providedIn: 'root' })
export class AlgoSignerWallet {

    /**
     * Sign group of transactions
     * 
     * @param transactions
     */
    async sign(transactions: Array<any>) {
        if (typeof AlgoSigner !== 'undefined') {
            try {
                let transactionsToSign = [];
                for (let i = 0; i < transactions.length; i++) {
                    transactionsToSign.push({ txn: AlgoSigner.encoding.msgpackToBase64(transactions[i].toByte()) });
                }

                let signedTransactions = await AlgoSigner.signTxn(transactionsToSign);

                let signed = [];
                for (let i = 0; i < signedTransactions.length; i++) {
                    if (signedTransactions[i]) {
                        signed.push(AlgoSigner.encoding.base64ToMsgpack(signedTransactions[i].blob));
                    }
                }

                return {
                    success: true,
                    message: '',
                    signed: signed
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'AlgoSigner is not connected.',
                    signed: []
                }
            }
        } else {
            return {
                success: false,
                message: 'AlgoSigner is not installed.',
                signed: []
            }
        };
    }
}
