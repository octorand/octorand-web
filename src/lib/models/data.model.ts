import { GenOnePrimeModel, GenTwoPrimeModel } from "./_index";

export class DataModel {

    initialised: boolean = false;
    gen_one_primes: Array<GenOnePrimeModel> = [];
    gen_two_primes: Array<GenTwoPrimeModel> = [];
}