declare var algosdk: any;

export class PredictionAlgoStorageModel {
    master: string = '';
    manager: string = '';
    name: string = '';
    masterShare: number = 0;
    managerShare: number = 0;
    volume: number = 0;
    option1: string = '';
    option2: string = '';
    option3: string = '';
    tickets1: number = 0;
    tickets2: number = 0;
    tickets3: number = 0;
    timer: number = 0;
    status: number = 0;
    managerPercentage: number = 0;
    winnerPercentage: number = 0;
    winner: number = 0;

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
                    this.option1 = value.subarray(0, 24).toString('utf-8').trim();
                    this.option2 = value.subarray(24, 48).toString('utf-8').trim();
                    this.option3 = value.subarray(48, 72).toString('utf-8').trim();
                    this.tickets1 = algosdk.decodeUint64(value.subarray(72, 80));
                    this.tickets2 = algosdk.decodeUint64(value.subarray(80, 88));
                    this.tickets3 = algosdk.decodeUint64(value.subarray(88, 96));
                    this.timer = algosdk.decodeUint64(value.subarray(96, 104));
                    this.status = algosdk.decodeUint64(value.subarray(104, 106));
                    this.managerPercentage = algosdk.decodeUint64(value.subarray(106, 108));
                    this.winnerPercentage = algosdk.decodeUint64(value.subarray(108, 110));
                    this.winner = algosdk.decodeUint64(value.subarray(110, 112));
                    break;
            }
        }
    }
}