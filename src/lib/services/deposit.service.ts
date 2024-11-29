import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class DepositService {

    /**
     * Construct component
     *
     * @param httpHelper
     */
    constructor(
        private httpHelper: HttpHelper
    ) { }

    /**
     * Sync deposits
     */
    async sync() {
        const data = {};
        return await this.httpHelper.post('deposit/sync', data, true);
    }
}