import { Injectable } from '@angular/core';
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";

declare var algosdk: any;

@Injectable({ providedIn: 'root' })
export class WalletConnectWallet {

    /**
     * Sign group of transactions
     * 
     * @param transactions
     */
    async sign(transactions: Array<any>) {

        let walletConnectConnection = new WalletConnect({
            bridge: "https://bridge.walletconnect.org",
            qrcodeModal: QRCodeModal,
        });

        if (walletConnectConnection.connected) {
            let transactionsToSign = [];
            for (let i = 0; i < transactions.length; i++) {
                transactionsToSign.push({ txn: Buffer.from(algosdk.encodeUnsignedTransaction(transactions[i])).toString("base64") });
            }

            let requestParams = [transactionsToSign];

            let request = formatJsonRpcRequest("algo_signTxn", requestParams);
            let signedTransactions = await walletConnectConnection.sendCustomRequest(request);

            let signed = [];
            for (let i = 0; i < signedTransactions.length; i++) {
                signed.push(new Uint8Array(Buffer.from(signedTransactions[i], "base64")));
            }

            return {
                success: true,
                message: '',
                signed: signed
            };
        } else {
            return {
                success: false,
                message: 'Wallet is not connected.',
                signed: []
            }
        }
    }
}
