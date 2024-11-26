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
}