import { Injectable } from '@angular/core';
import { StoreModel } from '@lib/models';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StoreHelper {

    store: Subject<any>;

    state: StoreModel;

    /**
     * Construct component
     */
    constructor() {
        this.store = new Subject<any>();

        this.state = {
            initialised: false,
            browse_badges: [],
            browse_sort: 'Id',
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
     * Set currently selected browse badges
     *
     * @param badges
     */
    setBrowseBadges(badges: Array<string>) {
        this.state.browse_badges = badges;
        this.store.next({ ...this.state });
    }

    /**
     * Set currently selected browse sort
     *
     * @param sort
     */
    setBrowseSort(sort: string) {
        this.state.browse_sort = sort;
        this.store.next({ ...this.state });
    }
}