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
            applications.push(pager[i]);
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
            assets.push(pager[i]);
        }

        return assets;
    }

    /**
     * Lookup balances for an asset
     *
     * @param id
     * @param min
     */
    async lookupAssetBalances(id: number, min: number = 0): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'balances';
        let balances = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAssetBalances(id).currencyGreaterThan(min), limit, key);
        for (let i = 0; i < pager.length; i++) {
            balances.push(pager[i]);
        }

        return balances;
    }

    /**
     * Lookup transactions for an asset
     *
     * @param id
     */
    async lookupAssetTransactions(id: number): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'transactions';
        let transactions = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAssetTransactions(id), limit, key);
        for (let i = 0; i < pager.length; i++) {
            transactions.push(pager[i]);
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
            transactions.push(pager[i]);
        }

        return transactions;
    }

    /**
     * Lookup asset transfer transactions from an account
     *
     * @param from
     * @param id
     */
    async lookupAssetTransferTransactions(from: string, id: number): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'transactions';
        let transactions = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupAccountTransactions(from).assetID(id).txType('axfer').currencyGreaterThan(0), limit, key);
        for (let i = 0; i < pager.length; i++) {
            transactions.push(pager[i]);
        }

        return transactions;
    }

    /**
     * Lookup logs for an application
     *
     * @param id
     */
    async lookupApplicationLogs(id: number): Promise<Array<any>> {
        let limit = environment.indexer_page_size;
        let key = 'log-data';
        let logs = [];

        let pager = await this.getPagedResults(this.getIndexerClient().lookupApplicationLogs(id), limit, key);
        for (let i = 0; i < pager.length; i++) {
            let log = pager[i]['logs'][0];
            logs.push(this.decodeLogEvent(log));
        }

        return logs;
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

    /**
     * Decode log event details
     *
     * @param log
     */
    private decodeLogEvent(log: string) {
        let value = Buffer.from(log, 'base64');

        let data = {
            code: value.subarray(0, 4).toString('utf-8').trim(),
            version: algosdk.decodeUint64(value.subarray(4, 12)),
            timestamp: algosdk.decodeUint64(value.subarray(12, 20)),
            prime: algosdk.decodeUint64(value.subarray(20, 28)),
            sender: algosdk.encodeAddress(value.subarray(28, 60)),
            name: '',
            params: {
                seller: null,
                price: null,
                amount: null,
                asset_id: null,
                name: null,
                index: null,
                value: null,
                theme: null,
                skin: null,
            }
        };

        switch (data.code) {
            case 'prby':
                data.name = 'prime_buy';
                data.params.seller = algosdk.encodeAddress(value.subarray(60, 92));
                data.params.price = algosdk.decodeUint64(value.subarray(92, 100));
                break;
            case 'prls':
                data.name = 'prime_list';
                data.params.price = algosdk.decodeUint64(value.subarray(60, 68));
                break;
            case 'prmt':
                data.name = 'prime_mint';
                data.params.amount = algosdk.decodeUint64(value.subarray(60, 68));
                break;
            case 'proi':
                data.name = 'prime_optin';
                data.params.asset_id = algosdk.decodeUint64(value.subarray(60, 68));
                break;
            case 'proo':
                data.name = 'prime_optout';
                data.params.asset_id = algosdk.decodeUint64(value.subarray(60, 68));
                break;
            case 'prrn':
                data.name = 'prime_rename';
                data.params.index = algosdk.decodeUint64(value.subarray(60, 68));
                data.params.value = algosdk.decodeUint64(value.subarray(68, 76));
                data.params.price = algosdk.decodeUint64(value.subarray(76, 84));
                break;
            case 'prrp':
                data.name = 'prime_repaint';
                data.params.theme = algosdk.decodeUint64(value.subarray(60, 68));
                data.params.skin = algosdk.decodeUint64(value.subarray(68, 76));
                data.params.price = algosdk.decodeUint64(value.subarray(76, 84));
                break;
            case 'prul':
                data.name = 'prime_unlist';
                break;
            case 'prug':
                data.name = 'prime_upgrade';
                break;
            case 'prwd':
                data.name = 'prime_withdraw';
                data.params.amount = algosdk.decodeUint64(value.subarray(60, 68));
                break;
            case 'prcl':
                data.name = 'prime_claim';
                break;
        }

        return data;
    }
}