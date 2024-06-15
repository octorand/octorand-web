import { Injectable } from '@angular/core';
import { StoreModel } from '@lib/models';

@Injectable({ providedIn: 'root' })
export class StoreHelper {

    state: StoreModel;

    /**
     * Construct component
     */
    constructor() {
        this.state = {
            initialised: false,
            browse_gen: 1,
            browse_sort: 'Id',
            browse_badges: [],
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
}