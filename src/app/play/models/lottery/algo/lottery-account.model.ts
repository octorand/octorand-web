declare var algosdk: any;

export class LotteryAlgoAccountModel {
    address: string = '';
    opted: boolean = false;
    volume: number = 0;
    percentage: number = 0;
    payout: number = 0;

    /**
     * Load storage values
     *
     * @param local
     */
    load(local: any) {
        for (let i = 0; i < local.length; i++) {
            let state = local[i];
            let key = Buffer.from(state.key, 'base64').toString('utf-8');
            let value = Buffer.from(state.value['bytes'], 'base64');

            switch (key) {
                case '01':
                    this.volume = algosdk.decodeUint64(value.subarray(0, 8));
                    break;
            }
        }
    }
}