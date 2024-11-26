import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class AuthService {

    constructor(private httpHelper: HttpHelper) { }

    /**
     * Setup authentication
     */
    async setup() {
        return await this.httpHelper.post('auth/setup', {});
    }

    /**
     * Verify authentication
     */
    async verify(transaction_id: string, private_key: string) {
        return await this.httpHelper.post('auth/verify', { transaction_id: transaction_id, private_key: private_key });
    }
}