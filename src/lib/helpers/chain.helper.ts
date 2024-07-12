import { Injectable } from '@angular/core';
import { AppHelper } from './app.helper';
import { ExodusWallet, PeraWalletWallet, DeflyWalletWallet } from '@lib/wallets';
import { environment } from '@environment';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class ChainHelper {

    /**
     * Algorand api client
     */
    private baseClient: any;

    /**
     * Algorand execution client
     */
    private algodClient: any;

    /**
     * Construct component
     *
     * @param appHelper
     * @param exodusWallet
     * @param peraWalletWallet
     * @param deflyWalletWallet
     */
    constructor(
        private appHelper: AppHelper,
        private exodusWallet: ExodusWallet,
        private peraWalletWallet: PeraWalletWallet,
        private deflyWalletWallet: DeflyWalletWallet
    ) {
        this.baseClient = algosdk;
        this.algodClient = new algosdk.Algodv2('', environment.algo_server, '');
    }

    /**
     * Get base connection to blockchain properties
     */
    getBaseClient(): any {
        return this.baseClient;
    }

    /**
     * Get client connection to blockchain
     */
    getAlgodClient(): any {
        return this.algodClient;
    }

    /**
     * Get contract method
     *
     * @param contract
     * @param method
     */
    getMethod(contract: any, method: string) {
        return contract.methods.find((m: any) => { return m.name == method });
    }

    /**
     * Submit transactions to blockchain
     *
     * @param transactions
     */
    async submitTransactions(transactions: Array<any>) {
        let success = false;
        let result = null;

        this.appHelper.showWarning('Please sign the transaction using your wallet.');

        let signs = await this.signTransactions(transactions);

        if (signs.success) {
            try {
                let transactionResult = await this.getAlgodClient().sendRawTransaction(signs.signed).do();
                this.appHelper.showSuccess('Transaction submitted successfully.');

                await this.waitForTransaction(transactionResult.txId);
                result = await this.getAlgodClient().pendingTransactionInformation(transactionResult.txId).do();

                this.appHelper.showSuccess('Transaction executed successfully.');
                success = true;
            } catch (error) {
                console.log(error);
                this.appHelper.showError('Unexpected error occurred.');
            }
        } else {
            this.appHelper.showError(signs.message);
        }

        return {
            success: success,
            result: result
        };
    }

    /**
     * Sign transaction using wallet
     *
     * @param transactions
     */
    private async signTransactions(transactions: Array<any>) {
        switch (this.appHelper.getWallet()) {
            case 'exodus':
                return await this.exodusWallet.sign(transactions);
            case 'pera-wallet':
                return await this.peraWalletWallet.sign(transactions);
            case 'defly-wallet':
                return await this.deflyWalletWallet.sign(transactions);
            default:
                return {
                    success: false,
                    message: 'Invalid wallet',
                    signed: []
                }
        }
    }

    /**
     * Wait for transaction to complete
     *
     * @param transaction
     */
    private async waitForTransaction(transaction: string) {
        let response = await this.getAlgodClient().status().do();
        let lastround = response["last-round"];

        while (true) {
            const pendingInfo = await this.getAlgodClient().pendingTransactionInformation(transaction).do();
            if (pendingInfo["confirmed-round"] !== null && pendingInfo["confirmed-round"] > 0) {
                break;
            }

            lastround++;

            await this.getAlgodClient().statusAfterBlock(lastround).do();
        }
    };
}