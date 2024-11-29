import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class AccountService {

    /**
     * Construct component
     *
     * @param httpHelper
     */
    constructor(
        private httpHelper: HttpHelper
    ) { }

    /**
     * Read account rankings
     */
    async rankings() {
        const data = {};
        return await this.httpHelper.post('account/rankings', data, true);
    }
}