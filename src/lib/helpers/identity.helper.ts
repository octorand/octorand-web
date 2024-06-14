import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class IdentityHelper {

    lookupUrl = 'https://api.nf.domains/nfd/lookup?address=';

    key: string = 'identities-1';
    values: Array<any> = [];

    /**
     * Construct component
     *
     * @param httpClient
     */
    constructor(private httpClient: HttpClient) {
        this.initData();
    }

    /**
     * Get details of a address
     *
     * @param address
     */
    get(address: string): string {
        let identity = this.values.find(value => value.address == address && value.expiry > moment().unix());
        if (identity) {
            return identity.name;
        }

        let name = address;
        if (address.length > 12) {
            name = address.slice(0, 6) + '...' + address.slice(-3);
        }

        this.httpClient.get(this.lookupUrl + address).subscribe({
            next: (value: any) => {
                if (value && value[address] && value[address]['name']) {
                    name = value[address]['name'];
                }

                this.updateIdentity(address, name);
            },
            error: () => {
                this.updateIdentity(address, name);
            }
        });

        return name;
    }

    /**
     * Update identity details
     *
     * @param address
     * @param name
     */
    private updateIdentity(address: string, name: string) {
        this.values = this.values.filter(value => value.address != address);

        this.values.push({
            address: address,
            name: name,
            expiry: moment().add(1, 'hours').unix()
        });

        localStorage.setItem(this.key, JSON.stringify({ values: this.values }));
    }

    /**
     * Initialise identity details
     */
    private initData() {
        let values = [];

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