import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class AuthService {

    /**
     * Construct component
     *
     * @param httpHelper
     */
    constructor(
        private httpHelper: HttpHelper
    ) { }

    /**
     * Setup authentication
     */
    async setup() {
        const body = {};
        return await this.httpHelper.post('auth/setup', body, false);
    }

    /**
     * Verify authentication
     */
    async verify(transaction_id: string, private_key: string) {
        const body = { transaction_id: transaction_id, private_key: private_key };
        return await this.httpHelper.post('auth/verify', body, false);
    }

    /**
     * Get authenticated account
     */
    async account() {
        const body = {};
        return await this.httpHelper.post('auth/account', body, true);
    }
}