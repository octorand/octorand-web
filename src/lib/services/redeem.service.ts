import { Injectable } from '@angular/core';
import { HttpHelper } from '@lib/helpers';

@Injectable({ providedIn: 'root' })
export class RedeemService {

    /**
     * Construct component
     *
     * @param httpHelper
     */
    constructor(
        private httpHelper: HttpHelper
    ) { }

    /**
     * Process redeem
     *
     * @param prime_generation
     * @param prime_position
     * @param stars
     * @param action
     */
    async process(prime_generation: number, prime_position: number, stars: number, action: string) {
        const data = {
            prime_generation: prime_generation,
            prime_position: prime_position,
            stars: stars,
            action: action
        };
        return await this.httpHelper.post('redeem/process', data, true);
    }
}