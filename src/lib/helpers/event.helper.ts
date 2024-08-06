import { Injectable } from '@angular/core';

const algosdk = require("algosdk");

@Injectable({ providedIn: 'root' })
export class EventHelper {

    /**
     * Decode log event details
     *
     * @param log
     */
    decode(log: string) {
        let value = Buffer.from(log, 'base64');

        let data: any = {
            code: value.subarray(0, 4).toString('utf-8').trim(),
            version: algosdk.decodeUint64(value.subarray(4, 12)),
            timestamp: algosdk.decodeUint64(value.subarray(12, 20)),
            params: null
        };

        switch (data.code) {
            case 'prby':
                data.params = this.decodePrimeBuyParams(data.version, value);
                break;
            case 'prcl':
                data.params = this.decodePrimeClaimParams(data.version, value);
                break;
            case 'prls':
                data.params = this.decodePrimeListParams(data.version, value);
                break;
            case 'prmt':
                data.params = this.decodePrimeMintParams(data.version, value);
                break;
            case 'proi':
                data.params = this.decodePrimeOptinParams(data.version, value);
                break;
            case 'proo':
                data.params = this.decodePrimeOptoutParams(data.version, value);
                break;
            case 'prrn':
                data.params = this.decodePrimeRenameParams(data.version, value);
                break;
            case 'prrp':
                data.params = this.decodePrimeRepaintParams(data.version, value);
                break;
            case 'prul':
                data.params = this.decodePrimeUnlistParams(data.version, value);
                break;
            case 'prug':
                data.params = this.decodePrimeUpgradeParams(data.version, value);
                break;
            case 'prwd':
                data.params = this.decodePrimeWithdrawParams(data.version, value);
                break;
            case 'imby':
                data.params = this.decodeItemBuyParams(data.version, value);
                break;
            case 'imcl':
                data.params = this.decodeItemClaimParams(data.version, value);
                break;
            case 'imls':
                data.params = this.decodeItemListParams(data.version, value);
                break;
            case 'immt':
                data.params = this.decodeItemMintParams(data.version, value);
                break;
            case 'imrn':
                data.params = this.decodeItemRenameParams(data.version, value);
                break;
            case 'imul':
                data.params = this.decodeItemUnlistParams(data.version, value);
                break;
        }

        return data;
    }

    /**
     * Decode prime buy params
     *
     * @param version
     * @parm value
     */
    decodePrimeBuyParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_buy',
            prime: null,
            sender: null,
            seller: null,
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.seller = algosdk.encodeAddress(value.subarray(60, 92));
                params.price = algosdk.decodeUint64(value.subarray(92, 100));
                break;
        }

        return params;
    }

    /**
     * Decode prime claim params
     *
     * @param version
     * @parm value
     */
    decodePrimeClaimParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_claim',
            prime: null,
            sender: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                break;
        }

        return params;
    }

    /**
     * Decode prime list params
     *
     * @param version
     * @parm value
     */
    decodePrimeListParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_list',
            prime: null,
            sender: null,
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.price = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode prime mint params
     *
     * @param version
     * @parm value
     */
    decodePrimeMintParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_mint',
            prime: null,
            sender: null,
            amount: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.amount = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode prime optin params
     *
     * @param version
     * @parm value
     */
    decodePrimeOptinParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_optin',
            prime: null,
            sender: null,
            asset_id: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.asset_id = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode prime optout params
     *
     * @param version
     * @parm value
     */
    decodePrimeOptoutParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_optout',
            prime: null,
            sender: null,
            asset_id: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.asset_id = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode prime rename params
     *
     * @param version
     * @parm value
     */
    decodePrimeRenameParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_rename',
            prime: null,
            sender: null,
            index: null,
            value: null,
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.index = algosdk.decodeUint64(value.subarray(60, 68));
                params.value = algosdk.decodeUint64(value.subarray(68, 76));
                params.price = algosdk.decodeUint64(value.subarray(76, 84));
                break;
        }

        return params;
    }

    /**
     * Decode prime repaint params
     *
     * @param version
     * @parm value
     */
    decodePrimeRepaintParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_repaint',
            prime: null,
            sender: null,
            theme: null,
            skin: null,
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.theme = algosdk.decodeUint64(value.subarray(60, 68));
                params.skin = algosdk.decodeUint64(value.subarray(68, 76));
                params.price = algosdk.decodeUint64(value.subarray(76, 84));
                break;
        }

        return params;
    }

    /**
     * Decode prime unlist params
     *
     * @param version
     * @parm value
     */
    decodePrimeUnlistParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_unlist',
            prime: null,
            sender: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                break;
        }

        return params;
    }

    /**
     * Decode prime upgrade params
     *
     * @param version
     * @parm value
     */
    decodePrimeUpgradeParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_upgrade',
            prime: null,
            sender: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                break;
        }

        return params;
    }

    /**
     * Decode prime withdraw params
     *
     * @param version
     * @parm value
     */
    decodePrimeWithdrawParams(version: number, value: Buffer) {
        let params = {
            name: 'prime_withdraw',
            prime: null,
            sender: null,
            amount: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.prime = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.amount = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode item buy params
     *
     * @param version
     * @parm value
     */
    decodeItemBuyParams(version: number, value: Buffer) {
        let params = {
            name: 'item_buy',
            item: null,
            sender: null,
            seller: null,
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.item = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.seller = algosdk.encodeAddress(value.subarray(60, 92));
                params.price = algosdk.decodeUint64(value.subarray(92, 100));
                break;
        }

        return params;
    }

    /**
     * Decode item claim params
     *
     * @param version
     * @parm value
     */
    decodeItemClaimParams(version: number, value: Buffer) {
        let params = {
            name: 'item_claim',
            item: null,
            sender: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.item = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                break;
        }

        return params;
    }

    /**
     * Decode item list params
     *
     * @param version
     * @parm value
     */
    decodeItemListParams(version: number, value: Buffer) {
        let params = {
            name: 'item_list',
            item: null,
            sender: null,
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.item = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.price = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode item mint params
     *
     * @param version
     * @parm value
     */
    decodeItemMintParams(version: number, value: Buffer) {
        let params = {
            name: 'item_mint',
            item: null,
            sender: null,
            amount: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.item = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.amount = algosdk.decodeUint64(value.subarray(60, 68));
                break;
        }

        return params;
    }

    /**
     * Decode item rename params
     *
     * @param version
     * @parm value
     */
    decodeItemRenameParams(version: number, value: Buffer) {
        let params = {
            name: 'item_rename',
            item: null,
            sender: null,
            value: '',
            price: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.item = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                params.value = value.subarray(60, 76).toString('utf-8').trim();
                params.price = algosdk.decodeUint64(value.subarray(76, 84));
                break;
        }

        return params;
    }

    /**
     * Decode item unlist params
     *
     * @param version
     * @parm value
     */
    decodeItemUnlistParams(version: number, value: Buffer) {
        let params = {
            name: 'item_unlist',
            item: null,
            sender: null,
        };

        switch (version) {
            case 0:
            case 1:
                params.item = algosdk.decodeUint64(value.subarray(20, 28));
                params.sender = algosdk.encodeAddress(value.subarray(28, 60));
                break;
        }

        return params;
    }
}