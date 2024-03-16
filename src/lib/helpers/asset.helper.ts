import { Injectable } from '@angular/core';
import { ChainHelper } from './chain.helper';

@Injectable({ providedIn: 'root' })
export class AssetHelper {

    key: string = 'assets-1';
    values: Array<any> = [];

    constructor(private chainHelper: ChainHelper) {
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
            this.chainHelper.lookupAsset(id).then((asset) => {
                this.values.push({
                    id: id,
                    unit: asset['params']['unit-name'],
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