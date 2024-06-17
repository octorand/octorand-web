import { Injectable } from '@angular/core';
import { IndexerHelper } from './indexer.helper';

@Injectable({ providedIn: 'root' })
export class AssetHelper {

    /**
     * Local storage key
     */
    private key: string = 'assets-1';

    /**
     * Saved asset values
     */
    private values: Array<any> = [];

    /**
     * Construct component
     *
     * @param indexerHelper
     */
    constructor(
        private indexerHelper: IndexerHelper
    ) {
        this.initData();
    }

    /**
     * Get details of a asset
     *
     * @param id
     */
    get(id: number): any {
        let asset = this.values.find(value => value.id == id);

        if (!asset) {
            this.indexerHelper.lookupAsset(id).then((asset) => {
                this.values.push({
                    id: id,
                    unit: asset['params']['unit-name'],
                    name: asset['params']['name'],
                    decimals: asset['params']['decimals']
                });

                localStorage.setItem(this.key, JSON.stringify({ values: this.values }));
            });
        }

        return asset;
    }

    /**
     * Initialise asset details
     */
    private initData() {
        let values = [
            {
                id: 0,
                unit: 'ALGO',
                decimals: 6
            }
        ];

        try {
            let storage = localStorage.getItem(this.key);
            if (storage) {
                let saved = JSON.parse(storage);
                if (Array.isArray(saved.values)) {
                    values = saved.values;
                }
            }
        } catch (error) { }

        this.values = values;
        localStorage.setItem(this.key, JSON.stringify({ values: this.values }));
    }
}