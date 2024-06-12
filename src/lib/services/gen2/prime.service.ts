import { Injectable } from '@angular/core';
import { GenTwoPrimeModel } from '@lib/models';
import { WordCulture, WordFiction, WordPart, WordPhrase, WordSmith } from '@lib/words';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class GenTwoPrimeService {

    /**
     * Create prime models from application states
     *
     * @param applications
     */
    list(applications: Array<any>): Array<GenTwoPrimeModel> {
        let models = [];
        for (let i = 0; i < applications.length; i++) {
            let model = new GenTwoPrimeModel();
            model = this.loadValues(model, applications[i]);
            models.push(model);
        }

        models = this.calculateRank(models);

        return models;
    }

    /**
     * Load values from contract information
     *
     * @param model
     * @param application
     */
    loadValues(model: GenTwoPrimeModel, application: any): GenTwoPrimeModel {
        model.application_id = application['id'];
        model.application_address = algosdk.getApplicationAddress(model.application_id);

        let global = application['params']['global-state'];
        for (let i = 0; i < global.length; i++) {
            let params = global[i];
            let key = Buffer.from(params.key, 'base64').toString('utf-8');
            let value = Buffer.from(params.value['bytes'], 'base64');

            switch (key) {
                case 'Prime':
                    model.id = algosdk.decodeUint64(value.subarray(0, 8));
                    model.platform_asset_id = algosdk.decodeUint64(value.subarray(8, 16));
                    model.prime_asset_id = algosdk.decodeUint64(value.subarray(16, 24));
                    model.legacy_asset_id = algosdk.decodeUint64(value.subarray(24, 32));
                    model.parent_application_id = algosdk.decodeUint64(value.subarray(32, 40));
                    model.theme = algosdk.decodeUint64(value.subarray(40, 42));
                    model.skin = algosdk.decodeUint64(value.subarray(42, 44));
                    model.is_founder = algosdk.decodeUint64(value.subarray(44, 45));
                    model.is_artifact = algosdk.decodeUint64(value.subarray(45, 46));
                    model.is_pioneer = algosdk.decodeUint64(value.subarray(46, 47));
                    model.is_explorer = algosdk.decodeUint64(value.subarray(47, 48));
                    model.score = algosdk.decodeUint64(value.subarray(48, 56));
                    model.price = algosdk.decodeUint64(value.subarray(56, 64));
                    model.seller = algosdk.encodeAddress(value.subarray(64, 96));
                    model.sales = algosdk.decodeUint64(value.subarray(96, 98));
                    model.drains = algosdk.decodeUint64(value.subarray(98, 100));
                    model.transforms = algosdk.decodeUint64(value.subarray(100, 102));
                    model.vaults = algosdk.decodeUint64(value.subarray(102, 104));
                    model.name = value.subarray(104, 120).toString('utf-8').trim();
                    break;
            }
        }

        return model;
    }

    /**
     * Calculate rank
     *
     * @param models
     */
    private calculateRank(models: Array<GenTwoPrimeModel>): Array<GenTwoPrimeModel> {
        var rank = 1;
        models.sort((first, second) => second.score - first.score);
        for (let i = 0; i < models.length; i++) {
            if (i > 0 && models[i].score < models[i - 1].score) {
                rank++;
            }
            models[i].rank = rank;
        }
        models.sort((first, second) => first.id - second.id);

        return models;
    }
}