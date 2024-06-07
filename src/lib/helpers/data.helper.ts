import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GenOnePrime } from '../models/gen1/prime.model';
import { GenTwoPrime } from '../models/gen2/prime.model';

@Injectable({ providedIn: 'root' })
export class DataHelper {

    data: Subject<any>;

    state: {
        initialised: boolean,
        gen1: {
            primes: Array<GenOnePrime>
        },
        gen2: {
            primes: Array<GenTwoPrime>
        }
    };

    constructor() {
        this.data = new Subject<any>();

        this.state = {
            initialised: false,
            gen1: {
                primes: []
            },
            gen2: {
                primes: []
            },
        };

        this.state.initialised = true;
    }

    /**
     * Set gen one primes
     *
     * @param primes
     */
    setGenOnePrimes(primes: Array<GenOnePrime>) {
        this.state.gen1.primes = primes;
        this.data.next({ ...this.state });
    }

    /**
     * Set gen two primes
     *
     * @param primes
     */
    setGenTwoPrimes(primes: Array<GenTwoPrime>) {
        this.state.gen2.primes = primes;
        this.data.next({ ...this.state });
    }

    /**
     * Get gen one primes
     */
    getGenOnePrimes(): Array<GenOnePrime> {
        return this.state.gen1.primes;
    }

    /**
     * Get gen two primes
     */
    getGenTwoPrimes(): Array<GenTwoPrime> {
        return this.state.gen2.primes;
    }
}