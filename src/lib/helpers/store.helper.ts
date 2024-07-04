import { Injectable } from '@angular/core';
import { StoreModel } from '@lib/models';

@Injectable({ providedIn: 'root' })
export class StoreHelper {

    /**
     * State of model
     */
    state: StoreModel;

    /**
     * Construct component
     */
    constructor() {
        this.state = {
            initialised: false,
            account_gen: 1,
            account_sort: 'Id',
            account_badges: [],
            browse_gen: 1,
            browse_sort: 'Rank',
            browse_badges: [],
            market_gen: 1,
            market_sort: 'Price',
            market_badges: [],
        };

        this.state.initialised = true;
    }

    /**
     * Get default state
     */
    getDefaultState(): StoreModel {
        return this.state;
    }

    /**
     * Set currently selected account generation
     *
     * @param gen
     */
    setAccountGen(gen: number) {
        this.state.account_gen = gen;
    }

    /**
     * Set currently selected account sort
     *
     * @param sort
     */
    setAccountSort(sort: string) {
        this.state.account_sort = sort;
    }

    /**
     * Set currently selected account badges
     *
     * @param badges
     */
    setAccountBadges(badges: Array<string>) {
        this.state.account_badges = badges;
    }

    /**
     * Set currently selected browse generation
     *
     * @param gen
     */
    setBrowseGen(gen: number) {
        this.state.browse_gen = gen;
    }

    /**
     * Set currently selected browse sort
     *
     * @param sort
     */
    setBrowseSort(sort: string) {
        this.state.browse_sort = sort;
    }

    /**
     * Set currently selected browse badges
     *
     * @param badges
     */
    setBrowseBadges(badges: Array<string>) {
        this.state.browse_badges = badges;
    }

    /**
     * Set currently selected market generation
     *
     * @param gen
     */
    setMarketGen(gen: number) {
        this.state.market_gen = gen;
    }

    /**
     * Set currently selected market sort
     *
     * @param sort
     */
    setMarketSort(sort: string) {
        this.state.market_sort = sort;
    }

    /**
     * Set currently selected market badges
     *
     * @param badges
     */
    setMarketBadges(badges: Array<string>) {
        this.state.market_badges = badges;
    }
}