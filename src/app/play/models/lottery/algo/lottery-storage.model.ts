declare var algosdk: any;

export class LotteryAlgoStorageModel {
    master: string = '';
    manager: string = '';
    name: string = '';
    masterShare: number = 0;
    managerShare: number = 0;
    volume: number = 0;
    winner1: string = '';
    winner2: string = '';
    winner3: string = '';
    timer: number = 0;
    status: number = 0;
    managerPercentage: number = 0;
    winnerPercentage1: number = 0;
    winnerPercentage2: number = 0;
    winnerPercentage3: number = 0;

    /**
     * Load storage values
     *
     * @param global
     */
    load(global: any) {
        for (let i = 0; i < global.length; i++) {
            let state = global[i];
            let key = Buffer.from(state.key, 'base64').toString('utf-8');
            let value = Buffer.from(state.value['bytes'], 'base64');

            switch (key) {
                case '01':
                    this.master = algosdk.encodeAddress(value.subarray(0, 32));
                    this.manager = algosdk.encodeAddress(value.subarray(32, 64));
                    this.name = value.subarray(64, 96).toString('utf-8').trim();
                    this.masterShare = algosdk.decodeUint64(value.subarray(96, 104));
                    this.managerShare = algosdk.decodeUint64(value.subarray(104, 112));
                    this.volume = algosdk.decodeUint64(value.subarray(112, 120));
                    break;
                case '02':
                    this.winner1 = algosdk.encodeAddress(value.subarray(0, 32));
                    this.winner2 = algosdk.encodeAddress(value.subarray(32, 64));
                    this.winner3 = algosdk.encodeAddress(value.subarray(64, 96));
                    this.timer = algosdk.decodeUint64(value.subarray(96, 104));
                    this.status = algosdk.decodeUint64(value.subarray(104, 106));
                    this.managerPercentage = algosdk.decodeUint64(value.subarray(106, 108));
                    this.winnerPercentage1 = algosdk.decodeUint64(value.subarray(108, 110));
                    this.winnerPercentage2 = algosdk.decodeUint64(value.subarray(110, 112));
                    this.winnerPercentage3 = algosdk.decodeUint64(value.subarray(112, 114));
                    break;
            }
        }

        let zeroAddress = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ';
        this.winner1 = this.winner1 != zeroAddress ? this.winner1 : '';
        this.winner2 = this.winner2 != zeroAddress ? this.winner2 : '';
        this.winner3 = this.winner3 != zeroAddress ? this.winner3 : '';
    }
}