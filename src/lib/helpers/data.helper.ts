import { Injectable } from '@angular/core';
import { DataModel, GenOnePrimeModel, GenTwoPrimeModel } from '@lib/models';
import { ChainHelper } from './chain.helper';
import { WordHelper } from './word.helper';
import { Subject } from 'rxjs';
import { environment } from '@environment';

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class DataHelper {

    data: Subject<any>;

    state: DataModel;

    /**
     * Construct component
     *
     * @param chainHelper
     * @param wordHelper
     */
    constructor(
        private chainHelper: ChainHelper,
        private wordHelper: WordHelper
    ) {
        this.data = new Subject<any>();

        this.state = {
            initialised: false,
            genOnePrimes: [],
            genTwoPrimes: [],
        };

        this.state.initialised = true;
    }

    /**
     * Load primes
     */
    loadPrimes() {
        let promises = [
            this.chainHelper.lookupAccountCreatedApplications(environment.gen1.manager_address),
            this.chainHelper.lookupAccountCreatedApplications(environment.gen2.manager_address),
        ];

        Promise.all(promises).then(values => {
            let genOnePrimes = this.listGenOne(values[0]);
            let genTwoPrimes = this.listGenTwo(values[1]);

            for (let i = 0; i < genOnePrimes.length; i++) {
                genOnePrimes[i].children = genTwoPrimes.filter(p => p.parent_application_id == genOnePrimes[i].application_id).map(p => { return { id: p.id, owner: p.owner } });
                if (genOnePrimes[i].children.filter(c => c.owner == genOnePrimes[i].owner).length == 8) {
                    genOnePrimes[i].badges.push('Family');
                }
            }

            for (let i = 0; i < genTwoPrimes.length; i++) {
                let parent = genOnePrimes.find(p => genTwoPrimes[i].parent_application_id == p.application_id);
                if (parent) {
                    genTwoPrimes[i].parent = { id: parent.id, owner: parent.owner };
                    if (parent.badges.includes('Family')) {
                        genTwoPrimes[i].badges.push('Family');
                    }
                }
            }

            this.state.genOnePrimes = genOnePrimes;
            this.state.genTwoPrimes = genTwoPrimes;

            this.data.next({ ...this.state });
        });
    }

    /**
     * Get default state
     */
    getDefaultState(): DataModel {
        return this.state;
    }

    /**
     * Create prime models from application states
     *
     * @param applications
     */
    private listGenOne(applications: Array<any>): Array<GenOnePrimeModel> {
        let models = [];

        for (let i = 0; i < applications.length; i++) {
            let model = new GenOnePrimeModel();
            model = this.loadGenOneValues(model, applications[i]);
            model = this.calculateGenOneBadges(model);
            models.push(model);
        }

        models = this.calculateGenOneRank(models);

        return models;
    }

    /**
     * Create prime models from application states
     *
     * @param applications
     */
    private listGenTwo(applications: Array<any>): Array<GenTwoPrimeModel> {
        let models = [];

        for (let i = 0; i < applications.length; i++) {
            let model = new GenTwoPrimeModel();
            model = this.loadGenTwoValues(model, applications[i]);
            model = this.calculateGenTwoBadges(model);
            models.push(model);
        }

        models = this.calculateGenTwoRank(models);

        return models;
    }

    /**
     * Load values from contract information
     *
     * @param model
     * @param application
     */
    private loadGenOneValues(model: GenOnePrimeModel, application: any): GenOnePrimeModel {
        model.application_id = application['id'];
        model.application_address = algosdk.getApplicationAddress(model.application_id);

        let global = application['params']['global-state'];
        for (let i = 0; i < global.length; i++) {
            let params = global[i];
            let key = Buffer.from(params.key, 'base64').toString('utf-8');
            let value = Buffer.from(params.value['bytes'], 'base64');

            switch (key) {
                case 'P1':
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
                case 'P2':
                    model.owner = algosdk.encodeAddress(value.subarray(0, 32));
                    model.rewards = algosdk.decodeUint64(value.subarray(32, 40));
                    model.royalties = algosdk.decodeUint64(value.subarray(40, 48));
                    break;
            }
        }

        return model;
    }

    /**
     * Load values from contract information
     *
     * @param model
     * @param application
     */
    private loadGenTwoValues(model: GenTwoPrimeModel, application: any): GenTwoPrimeModel {
        model.application_id = application['id'];
        model.application_address = algosdk.getApplicationAddress(model.application_id);

        let global = application['params']['global-state'];
        for (let i = 0; i < global.length; i++) {
            let params = global[i];
            let key = Buffer.from(params.key, 'base64').toString('utf-8');
            let value = Buffer.from(params.value['bytes'], 'base64');

            switch (key) {
                case 'P1':
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
                case 'P2':
                    model.owner = algosdk.encodeAddress(value.subarray(0, 32));
                    model.rewards = algosdk.decodeUint64(value.subarray(32, 40));
                    model.royalties = algosdk.decodeUint64(value.subarray(40, 48));
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
    private calculateGenOneBadges(model: GenOnePrimeModel): GenOnePrimeModel {
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

        if (model.rewards == 0) {
            badges.push('Drained');
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
     * Calculate badges
     *
     * @param model
     */
    private calculateGenTwoBadges(model: GenTwoPrimeModel): GenTwoPrimeModel {
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

        if (model.rewards == 0) {
            badges.push('Drained');
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
        let char8 = model.name.charAt(8);
        let char9 = model.name.charAt(9);
        let char10 = model.name.charAt(10);
        let char11 = model.name.charAt(11);
        let char12 = model.name.charAt(12);
        let char13 = model.name.charAt(13);
        let char14 = model.name.charAt(14);
        let char15 = model.name.charAt(15);

        if ((char0 == char2) && (char1 == char3) && (char4 == char6) && (char5 == char7) && (char8 == char10) && (char9 == char11) && (char12 == char14) && (char13 == char15)) {
            fancy = true;
        }

        if ((char0 == char1) && (char2 == char3) && (char4 == char5) && (char6 == char7) && (char8 == char9) && (char10 == char11) && (char12 == char13) && (char14 == char15)) {
            fancy = true;
        }

        if ((char0 == char15) && (char1 == char14) && (char2 == char13) && (char3 == char12) && (char4 == char11) && (char5 == char10) && (char6 == char9) && (char7 == char8)) {
            fancy = true;
        }

        if ((char0 == char8) && (char1 == char9) && (char2 == char10) && (char3 == char11) && (char4 == char12) && (char5 == char13) && (char6 == char14) && (char7 == char15)) {
            fancy = true;
        }

        if (fancy && !equidistant) {
            badges.push('Fancy');
        }

        let wordSection1 = model.name.substring(0, 8);
        let wordSection2 = model.name.substring(8);

        let smithFind = this.wordHelper.searchSmith(model.name);
        let smithFind1 = this.wordHelper.searchSmith(wordSection1);
        let smithFind2 = this.wordHelper.searchSmith(wordSection2);

        let fictionFind = this.wordHelper.searchFiction(model.name);
        let fictionFind1 = this.wordHelper.searchFiction(wordSection1);
        let fictionFind2 = this.wordHelper.searchFiction(wordSection2);

        let cultureFind = this.wordHelper.searchCulture(model.name);
        let cultureFind1 = this.wordHelper.searchCulture(wordSection1);
        let cultureFind2 = this.wordHelper.searchCulture(wordSection2);

        let phraseFind = this.wordHelper.searchPhrase(model.name);
        let phraseFind1 = this.wordHelper.searchPhrase(wordSection1);
        let phraseFind2 = this.wordHelper.searchPhrase(wordSection2);

        if (smithFind || (smithFind1 && smithFind2)) {
            badges.push('Wordsmith');
        } else if (fictionFind || (fictionFind1 && fictionFind2) || (smithFind1 && fictionFind2) || (smithFind2 && fictionFind1)) {
            badges.push('Fiction');
        } else if (cultureFind || (cultureFind1 && cultureFind2) || (smithFind1 && cultureFind2) || (smithFind2 && cultureFind1)) {
            badges.push('Culture');
        } else if (phraseFind || (phraseFind1 && phraseFind2)) {
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
    private calculateGenOneRank(models: Array<GenOnePrimeModel>): Array<GenOnePrimeModel> {
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

    /**
     * Calculate rank
     *
     * @param models
     */
    private calculateGenTwoRank(models: Array<GenTwoPrimeModel>): Array<GenTwoPrimeModel> {
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