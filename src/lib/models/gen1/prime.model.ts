declare var algosdk: any;

export class GenOnePrime {

    id: number = 0;
    platform_asset_id: number = 0;
    prime_asset_id: number = 0;
    legacy_asset_id: number = 0;
    parent_application_id: number = 0;
    theme: number = 0;
    skin: number = 0;
    is_founder: number = 0;
    is_artifact: number = 0;
    is_pioneer: number = 0;
    is_explorer: number = 0;
    score: number = 0;
    price: number = 0;
    seller: string = '';
    sales: number = 0;
    drains: number = 0;
    transforms: number = 0;
    vaults: number = 0;
    name: string = '';
    parent_id: number = 0;
    application_id: number = 0;
    application_address: string = '';

    /**
     * Load values from contract information
     *
     * @param application
     */
    async load(application: any) {
        this.application_id = application['id'];
        this.application_address = algosdk.getApplicationAddress(this.application_id);

        let global = application['params']['global-state'];
        for (let i = 0; i < global.length; i++) {
            let params = global[i];
            let key = Buffer.from(params.key, 'base64').toString('utf-8');
            let value = Buffer.from(params.value['bytes'], 'base64');

            switch (key) {
                case 'Prime':
                    this.id = algosdk.decodeUint64(value.subarray(0, 8));
                    this.platform_asset_id = algosdk.decodeUint64(value.subarray(8, 16));
                    this.prime_asset_id = algosdk.decodeUint64(value.subarray(16, 24));
                    this.legacy_asset_id = algosdk.decodeUint64(value.subarray(24, 32));
                    this.parent_application_id = algosdk.decodeUint64(value.subarray(32, 40));
                    this.theme = algosdk.decodeUint64(value.subarray(40, 42));
                    this.skin = algosdk.decodeUint64(value.subarray(42, 44));
                    this.is_founder = algosdk.decodeUint64(value.subarray(44, 45));
                    this.is_artifact = algosdk.decodeUint64(value.subarray(45, 46));
                    this.is_pioneer = algosdk.decodeUint64(value.subarray(46, 47));
                    this.is_explorer = algosdk.decodeUint64(value.subarray(47, 48));
                    this.score = algosdk.decodeUint64(value.subarray(48, 56));
                    this.price = algosdk.decodeUint64(value.subarray(56, 64));
                    this.seller = algosdk.encodeAddress(value.subarray(64, 96));
                    this.sales = algosdk.decodeUint64(value.subarray(96, 98));
                    this.drains = algosdk.decodeUint64(value.subarray(98, 100));
                    this.transforms = algosdk.decodeUint64(value.subarray(100, 102));
                    this.vaults = algosdk.decodeUint64(value.subarray(102, 104));
                    this.name = value.subarray(104, 112).toString('utf-8').trim();
                    break;
            }
        }
    }
}