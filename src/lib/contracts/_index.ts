import { environment } from '@environment';

import * as TestnetGenOnePrimeAppContract from "./testnet/gen1/prime/app/contract.json";
import * as MainnetGenOnePrimeAppContract from "./mainnet/gen1/prime/app/contract.json";
const GenOnePrimeAppContract = (environment.version == 'testnet') ? TestnetGenOnePrimeAppContract : MainnetGenOnePrimeAppContract;
export { GenOnePrimeAppContract };