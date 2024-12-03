import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class PrimeService {

    /**
     * Construct component
     *
     * @param httpHelper
     */
    constructor(
        private httpHelper: HttpHelper
    ) { }

    /**
     * Read all primes
     */
    async all() {
        const body = {};
        return await this.httpHelper.post('prime/all', body, false);
    }
}