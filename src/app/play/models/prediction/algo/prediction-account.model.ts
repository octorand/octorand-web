declare var algosdk: any;

export class PredictionAlgoAccountModel {
    address: string = '';
    opted: boolean = false;
    withdrawn: boolean = false;
    tickets1: number = 0;
    tickets2: number = 0;
    tickets3: number = 0;
    volume: number = 0;
    percentage1: number = 0;
    percentage2: number = 0;
    percentage3: number = 0;
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
                    this.tickets1 = algosdk.decodeUint64(value.subarray(0, 8));
                    this.tickets2 = algosdk.decodeUint64(value.subarray(8, 16));
                    this.tickets3 = algosdk.decodeUint64(value.subarray(16, 24));
                    this.volume = algosdk.decodeUint64(value.subarray(24, 32));
                    this.withdrawn = algosdk.decodeUint64(value.subarray(32, 40));
                    break;
            }
        }
    }
}