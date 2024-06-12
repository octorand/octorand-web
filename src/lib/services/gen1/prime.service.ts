import { Injectable } from '@angular/core';
import { WordHelper } from '@lib/helpers';
import { GenOnePrimeModel } from '@lib/models';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class GenOnePrimeService {

    /**
     * Construct component
     *
     * @param wordHelper
     */
    constructor(
        private wordHelper: WordHelper
    ) { }

    /**
     * Create prime models from application states
     *
     * @param applications
     */
    list(applications: Array<any>): Array<GenOnePrimeModel> {
        let models = [];

        let start = Date.now();

        for (let i = 0; i < applications.length; i++) {
            let model = new GenOnePrimeModel();
            model = this.loadValues(model, applications[i]);
            model = this.calculateBadges(model);
            models.push(model);
        }

        models = this.calculateRank(models);

        let end = Date.now();

        console.log((end - start) * 8 / 1000);

        return models;
    }

    /**
     * Load values from contract information
     *
     * @param model
     * @param application
     */
    loadValues(model: GenOnePrimeModel, application: any): GenOnePrimeModel {
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
                    model.name = value.subarray(104, 112).toString('utf-8').trim();
                    break;
            }
        }

        return model;
    }

    /**
     * Calculate badges
     *
     * @param model
     */
    private calculateBadges(model: GenOnePrimeModel): GenOnePrimeModel {
        let badges: Array<string> = [];

        if (model.is_founder) {
            badges.push('Founder');
        }

        if (model.is_artifact) {
            badges.push('Artifact');
        }

        if (model.is_pioneer) {
            badges.push('Pioneer');
        }

        if (model.is_explorer) {
            badges.push('Explorer');
        }

        if (model.transforms == 0) {
            badges.push('Pristine');
        }

        if (model.drains == 0) {
            badges.push('Bountiful');
        }

        if (model.transforms >= 100) {
            badges.push('Chameleon');
        } else if (model.transforms >= 50) {
            badges.push('Shapeshifter');
        } else if (model.transforms >= 25) {
            badges.push('Changeling');
        }

        if (model.sales >= 10) {
            badges.push('Exotic');
        } else if (model.sales >= 5) {
            badges.push('Flipper');
        }

        let equidistant = true;
        for (let i = 0; i < model.name.length - 1; i++) {
            if (model.name.charAt(i) != model.name.charAt(i + 1)) {
                equidistant = false;
            }
        }

        if (equidistant) {
            badges.push('Equidistant');
        }

        let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (alphabet.includes(model.name)) {
            badges.push('Straight');
        }

        let fancy = false;

        let char0 = model.name.charAt(0);
        let char1 = model.name.charAt(1);
        let char2 = model.name.charAt(2);
        let char3 = model.name.charAt(3);
        let char4 = model.name.charAt(4);
        let char5 = model.name.charAt(5);
        let char6 = model.name.charAt(6);
        let char7 = model.name.charAt(7);

        if ((char0 == char2) && (char1 == char3) && (char4 == char6) && (char5 == char7)) {
            fancy = true;
        }

        if ((char0 == char1) && (char2 == char3) && (char4 == char5) && (char6 == char7)) {
            fancy = true;
        }

        if ((char0 == char7) && (char1 == char6) && (char2 == char5) && (char3 == char4)) {
            fancy = true;
        }

        if ((char0 == char4) && (char1 == char5) && (char2 == char6) && (char3 == char7)) {
            fancy = true;
        }

        if (fancy && !equidistant) {
            badges.push('Fancy');
        }

        let smithFind = this.wordHelper.searchSmith(model.name);
        let fictionFind = this.wordHelper.searchFiction(model.name);
        let cultureFind = this.wordHelper.searchCulture(model.name);
        let phraseFind = this.wordHelper.searchPhrase(model.name);

        if (smithFind) {
            badges.push('Wordsmith');
        } else if (fictionFind) {
            badges.push('Fiction');
        } else if (cultureFind) {
            badges.push('Culture');
        } else if (phraseFind) {
            badges.push('Phrase');
        }

        model.badges = badges;

        return model;
    }

    /**
     * Calculate rank
     *
     * @param models
     */
    private calculateRank(models: Array<GenOnePrimeModel>): Array<GenOnePrimeModel> {
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