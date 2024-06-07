import { Injectable } from '@angular/core';
import { DataModel } from '../models/data.model';
import { GenOnePrimeModel } from '../models/gen1/prime.model';
import { GenTwoPrimeModel } from '../models/gen2/prime.model';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DataHelper {

    data: Subject<any>;

    state: DataModel;

    constructor() {
        this.data = new Subject<any>();

        this.state = {
            initialised: false,
            genOnePrimes: [],
            genTwoPrimes: [],
        };

        this.state.initialised = true;
    }

    /**
     * Set gen one primes
     *
     * @param primes
     */
    setGenOnePrimes(primes: Array<GenOnePrimeModel>) {
        this.state.genOnePrimes = primes;
        this.data.next({ ...this.state });
    }

    /**
     * Set gen two primes
     *
     * @param primes
     */
    setGenTwoPrimes(primes: Array<GenTwoPrimeModel>) {
        this.state.genTwoPrimes = primes;
        this.data.next({ ...this.state });
    }

    /**
     * Get default state
     */
    getDefaultState(): DataModel {
        return this.state;
    }
}