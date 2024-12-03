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
        const body = {};
        return await this.httpHelper.post('account/rankings', body, true);
    }
}