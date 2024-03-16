import { Injectable } from '@angular/core';
import { AppHelper } from './app.helper';
import { AlgoSignerWallet, ExodusWallet, PeraWalletWallet, DeflyWalletWallet, WalletConnectWallet } from '@lib/wallets';
import { environment } from '@environment';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class ChainHelper {

    private baseClient: any;
    private algodClient: any;
    private indexerClient: any;

    constructor(
        private appHelper: AppHelper,
        private algoSignerWallet: AlgoSignerWallet,
        private exodusWallet: ExodusWallet,
        private peraWalletWallet: PeraWalletWallet,
        private deflyWalletWallet: DeflyWalletWallet,
        private walletConnectWallet: WalletConnectWallet
    ) {
        this.baseClient = algosdk;
        this.algodClient = new algosdk.Algodv2('', environment.algo_server, '');
        this.indexerClient = new algosdk.Indexer('', environment.algo_indexer, '');
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
     * Get indexer connection to blockchain
     */
    getIndexerClient(): any {
        return this.indexerClient;
    }

    /**
     * Lookup account by address
     *
     * @param address
     */
    async lookupAccount(address: string): Promise<any> {
        let response = await this.getIndexerClient().lookupAccountByID(address).do();
        let account = response['account'];

        return account;
    }

    /**
     * Lookup asset by id
     *
     * @param id
     */
    async lookupAsset(id: number): Promise<any> {
        let response = await this.getIndexerClient().lookupAssetByID(id).do();
        let asset = response['asset'];

        return asset;
    }

    /**
     * Lookup application by id
     *
     * @param id
     */
    async lookupApplication(id: number): Promise<any> {
        let response = await this.getIndexerClient().lookupApplications(id).do();
        let application = response['application'];

        return application;
    }

    /**
     * Lookup account local states
     *
     * @param id
     * @param address
     */
    async lookupAccountApplicationLocalStates(id: number, address: string): Promise<any> {
        let response = await this.getIndexerClient().lookupAccountAppLocalStates(address).applicationID(id).do();

        return {
            address: address,
            states: response['apps-local-states']
        };
    }

    /**
     * Lookup applications created by an account
     *
     * @param address
     */
    async lookupAccountCreatedApplications(address: string): Promise<Array<any>> {
        let limit = 1000;
        let resultsCount = 1;
        let nextToken = '';

        let applications = [];

        while (resultsCount > 0) {
            let response = await this.getIndexerClient().lookupAccountCreatedApplications(address).limit(limit).nextToken(nextToken).do();

            let data = response['applications'];
            for (let i = 0; i < data.length; i++) {
                applications.push(data[i]);
            }

            resultsCount = data.length;
            if (resultsCount > 0) {
                nextToken = response['next-token'];
            }
        }

        return applications;
    }

    /**
     * Lookup transactions for an account or asset
     *
     * @param address
     */
    async lookupAccountTransactions(id: number): Promise<Array<any>> {
        let limit = 1000;
        let resultsCount = 1;
        let nextToken = '';

        let transactions = [];

        while (resultsCount > 0) {
            let response = await this.getIndexerClient().lookupAssetTransactions(id).limit(limit).nextToken(nextToken).do();

            let data = response['transactions'];
            for (let i = 0; i < data.length; i++) {
                transactions.push(data[i]);
            }

            resultsCount = data.length;
            if (resultsCount > 0) {
                nextToken = response['next-token'];
            }
        }

        return transactions;
    }

    /**
     * Lookup payment transactions from an account
     *
     * @param from
     */
    async lookupPaymentTransactions(from: string): Promise<Array<any>> {
        let limit = 1000;
        let resultsCount = 1;
        let nextToken = '';

        let transactions = [];

        while (resultsCount > 0) {
            let response = await this.getIndexerClient().lookupAccountTransactions(from).txType('pay').currencyGreaterThan(0).limit(limit).nextToken(nextToken).do();

            let data = response['transactions'];
            for (let i = 0; i < data.length; i++) {
                transactions.push(data[i]);
            }

            resultsCount = data.length;
            if (resultsCount > 0) {
                nextToken = response['next-token'];
            }
        }

        return transactions;
    }

    /**
     * Lookup asset transfer transactions from an account
     *
     * @param from
     */
    async lookupAssetTransferTransactions(from: string, id: number): Promise<Array<any>> {
        let limit = 1000;
        let resultsCount = 1;
        let nextToken = '';

        let transactions = [];

        while (resultsCount > 0) {
            let response = await this.getIndexerClient().lookupAccountTransactions(from).assetID(id).txType('axfer').currencyGreaterThan(0).limit(limit).nextToken(nextToken).do();

            let data = response['transactions'];
            for (let i = 0; i < data.length; i++) {
                transactions.push(data[i]);
            }

            resultsCount = data.length;
            if (resultsCount > 0) {
                nextToken = response['next-token'];
            }
        }

        return transactions;
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
            case 'algo-signer':
                return await this.algoSignerWallet.sign(transactions);
            case 'exodus':
                return await this.exodusWallet.sign(transactions);
            case 'pera-wallet':
                return await this.peraWalletWallet.sign(transactions);
            case 'defly-wallet':
                return await this.deflyWalletWallet.sign(transactions);
            case 'wallet-connect':
                return await this.walletConnectWallet.sign(transactions);
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