import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import { environment } from '@environment';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class IndexerHelper {

    /**
     * Algorand indexer client
     */
    private indexerClient: any;

    /**
     * Construct component
     */
    constructor() {
        this.indexerClient = new algosdk.Indexer('', environment.algo_indexer, '');
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
        let limit = environment.indexer_page_size;
        let key = 'applications';
        let applications = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAccountCreatedApplications(address), limit, key);
        for (let i = 0; i < pager.length; i++) {
            applications.push(pager[i])
        }

        return applications;
    }

    /**
     * Lookup assets created by an account
     *
     * @param address
     */
    async lookupAccountCreatedAssets(address: string): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'assets';
        let assets = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAccountCreatedAssets(address), limit, key);
        for (let i = 0; i < pager.length; i++) {
            assets.push(pager[i])
        }

        return assets;
    }

    /**
     * Lookup transactions for an asset
     *
     * @param address
     */
    async lookupAssetTransactions(id: number): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'transactions';
        let transactions = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAssetTransactions(id), limit, key);
        for (let i = 0; i < pager.length; i++) {
            transactions.push(pager[i])
        }

        return transactions;
    }

    /**
     * Lookup payment transactions from an account
     *
     * @param from
     */
    async lookupPaymentTransactions(from: string): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'transactions';
        let transactions = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAccountTransactions(from).txType('pay').currencyGreaterThan(0), limit, key);
        for (let i = 0; i < pager.length; i++) {
            transactions.push(pager[i])
        }

        return transactions;
    }

    /**
     * Lookup asset transfer transactions from an account
     *
     * @param from
     */
    async lookupAssetTransferTransactions(from: string, id: number): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'transactions';
        let transactions = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAccountTransactions(from).assetID(id).txType('axfer').currencyGreaterThan(0), limit, key);
        for (let i = 0; i < pager.length; i++) {
            transactions.push(pager[i])
        }

        return transactions;
    }

    /**
     * Get a list of paged results from indexer
     *
     * @param callback
     * @param limit
     * @param key
     */
    private async getPagedResults(callback: any, limit: number, key: string) {
        let entries = [];
        let pages: Array<any> = [];
        let hashes: Array<string> = [];

        let next = '';
        while (next !== undefined) {
            let response = await callback.limit(limit).nextToken(next).do();
            let data = response[key];
            next = response['next-token'];

            if (pages.includes(next)) {
                break;
            } else {
                pages.push(next);
            }

            if (data) {
                for (let i = 0; i < data.length; i++) {
                    let entry = data[i];
                    let hash = Md5.hashStr(JSON.stringify(entry));

                    if (!hashes.includes(hash)) {
                        entries.push(entry);
                        hashes.push(hash);
                    }
                }
            }
        }

        return entries;
    }
}