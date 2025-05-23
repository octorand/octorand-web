import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PrimeService {

    /**
     * Read all primes
     */
    async all() {
        return [
            {
                "id": 129,
                "generation": 1,
                "position": 128,
                "score": 188
            },
            {
                "id": 147,
                "generation": 1,
                "position": 146,
                "score": 1682
            },
            {
                "id": 322,
                "generation": 1,
                "position": 321,
                "score": 1120
            },
            {
                "id": 464,
                "generation": 1,
                "position": 463,
                "score": 1100
            },
            {
                "id": 478,
                "generation": 1,
                "position": 477,
                "score": 742
            },
            {
                "id": 761,
                "generation": 1,
                "position": 760,
                "score": 1210
            },
            {
                "id": 859,
                "generation": 1,
                "position": 858,
                "score": 5577
            },
            {
                "id": 964,
                "generation": 1,
                "position": 963,
                "score": 5972
            },
            {
                "id": 998,
                "generation": 1,
                "position": 997,
                "score": 2458
            },
            {
                "id": 1000,
                "generation": 1,
                "position": 999,
                "score": 6
            },
            {
                "id": 4696,
                "generation": 2,
                "position": 3695,
                "score": 1240
            }
        ];
    }
}