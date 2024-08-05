import { Injectable } from '@angular/core';
import { CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';
import { CollectionGuardians, CollectionTakos } from '@lib/collections';
import { IndexerHelper } from './indexer.helper';
import { Subject } from 'rxjs';
import { environment } from '@environment';
import * as Contracts from '@lib/contracts';

const algosdk = require("algosdk");

@Injectable({ providedIn: 'root' })
export class LaunchpadHelper {

    /**
     * Observable subject
     */
    launchpad: Subject<any>;

    /**
     * State of model
     */
    private state: LaunchpadModel;

    /**
     * Construct component
     *
     * @param indexerHelper
     */
    constructor(
        private indexerHelper: IndexerHelper
    ) {
        this.launchpad = new Subject<any>();
        this.state = new LaunchpadModel();
        this.initTasks();
    }

    /**
     * Get default state
     */
    getDefaultState(): LaunchpadModel {
        return this.state;
    }

    /**
     * Initialize tasks
     */
    initTasks() {
        this.loadItemDetails();
    }

    /**
     * Load items
     */
    loadItemDetails() {
        let promises = [
            this.indexerHelper.lookupAccountCreatedApplications(environment.launchpad.guardians.manager_address),
            this.indexerHelper.lookupAccountCreatedApplications(environment.launchpad.takos.manager_address),
        ];

        Promise.all(promises).then(values => {
            let collections = [
                this.listItems('guardians', values[0]),
                this.listItems('takos', values[1]),
            ];

            this.state.collections = collections;
            this.state.initialised = true;

            this.launchpad.next({ ...this.state });
        });
    }

    /**
     * Create collection models from application states
     *
     * @param collection_id
     * @param applications
     */
    private listItems(collection_id: string, applications: Array<any>): CollectionModel {
        let collection = new CollectionModel();

        let definition = CollectionGuardians;
        let platform_asset_id = 0;
        let manager_address = '';
        let artist_address = '';
        let treasury_address = '';
        let contracts = {};
        let abis = {};

        switch (collection_id) {
            case 'guardians':
                definition = CollectionGuardians;
                platform_asset_id = environment.launchpad.guardians.platform.asset_id;
                manager_address = environment.launchpad.guardians.manager_address;
                artist_address = environment.launchpad.guardians.artist_address;
                treasury_address = environment.launchpad.guardians.treasury_address;
                contracts = environment.launchpad.guardians.contracts;
                abis = {
                    app: Contracts.LaunchpadGuardiansItemAppContract,
                    buy: Contracts.LaunchpadGuardiansItemBuyContract,
                    claim: Contracts.LaunchpadGuardiansItemClaimContract,
                    list: Contracts.LaunchpadGuardiansItemListContract,
                    mint: Contracts.LaunchpadGuardiansItemMintContract,
                    rename: Contracts.LaunchpadGuardiansItemRenameContract,
                    unlist: Contracts.LaunchpadGuardiansItemUnlistContract
                };
                break;
            case 'takos':
                definition = CollectionTakos;
                platform_asset_id = environment.launchpad.takos.platform.asset_id;
                manager_address = environment.launchpad.takos.manager_address;
                artist_address = environment.launchpad.takos.artist_address;
                treasury_address = environment.launchpad.takos.treasury_address;
                contracts = environment.launchpad.takos.contracts;
                abis = {
                    app: Contracts.LaunchpadTakosItemAppContract,
                    buy: Contracts.LaunchpadTakosItemBuyContract,
                    claim: Contracts.LaunchpadTakosItemClaimContract,
                    list: Contracts.LaunchpadTakosItemListContract,
                    mint: Contracts.LaunchpadTakosItemMintContract,
                    rename: Contracts.LaunchpadTakosItemRenameContract,
                    unlist: Contracts.LaunchpadTakosItemUnlistContract
                };
                break;
        }

        collection.id = definition.id;
        collection.singular_name = definition.singular_name;
        collection.plural_name = definition.plural_name;
        collection.description = definition.description;
        collection.artist_name = definition.artist_name;
        collection.item_digits = definition.item_digits;
        collection.social_twitter = definition.social_twitter;
        collection.social_discord = definition.social_discord;
        collection.seller_market_share = definition.seller_market_share;
        collection.artist_market_share = definition.artist_market_share;
        collection.admin_market_share = definition.admin_market_share;
        collection.rename_price = definition.rename_price;
        collection.rename_admin_share = definition.rename_admin_share;
        collection.rename_treasury_share = definition.rename_treasury_share;
        collection.rename_burner_share = definition.rename_burner_share;
        collection.params = definition.params;
        collection.items = [];

        collection.platform_asset_id = platform_asset_id;
        collection.manager_address = manager_address;
        collection.artist_address = artist_address;
        collection.treasury_address = treasury_address;
        collection.abis = abis;
        collection.contracts = contracts;

        for (let i = 0; i < applications.length; i++) {
            let item = new ItemModel();
            item = this.loadValues(collection_id, item, applications[i]);

            let item_definition = definition.items.find(x => x.id == item.id);
            if (item_definition) {
                item.score = item_definition.score;
                item.rank = item_definition.rank;
                item.image = item_definition.image;
                item.params = item_definition.params;
                item.score_display = Math.floor(item.score / 100);
            }

            collection.items.push(item);
        }

        collection.stats_count = collection.items.length;
        collection.stats_owners = (new Set(collection.items.map(x => x.owner))).size;
        collection.stats_listed = collection.items.filter(x => x.price > 0).length;

        return collection;
    }

    /**
     * Load values from contract information
     *
     * @param collection_id
     * @param model
     * @param application
     */
    private loadValues(collection_id: string, model: ItemModel, application: any): ItemModel {
        model.application_id = application['id'];
        model.application_address = algosdk.getApplicationAddress(model.application_id);

        let global = application['params']['global-state'];
        for (let i = 0; i < global.length; i++) {
            let params = global[i];
            let key = Buffer.from(params.key, 'base64').toString('utf-8');
            let value = Buffer.from(params.value['bytes'], 'base64');

            switch (key) {
                case 'P':
                    model.id = algosdk.decodeUint64(value.subarray(0, 8));
                    model.platform_asset_id = algosdk.decodeUint64(value.subarray(8, 16));
                    model.item_asset_id = algosdk.decodeUint64(value.subarray(16, 24));
                    model.rewards = algosdk.decodeUint64(value.subarray(24, 32));
                    model.price = algosdk.decodeUint64(value.subarray(32, 40));
                    model.seller = algosdk.encodeAddress(value.subarray(40, 72));
                    model.owner = algosdk.encodeAddress(value.subarray(72, 104));
                    model.name = value.subarray(104, 120).toString('utf-8').trim();
                    break;
            }
        }

        model.id_text = String(model.id).padStart(3, '0');
        model.url = '/tools/launchpad/' + collection_id + '/item/' + model.id_text;
        model.is_listed = model.price > 0 ? true : false;

        return model;
    }
}