import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeBuyContract, GenOnePrimeListContract, GenOnePrimeUnlistContract, GenTwoPrimeBuyContract, GenTwoPrimeListContract, GenTwoPrimeUnlistContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class CollectionPrimeMarketPage implements OnInit, OnChanges {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
   * Data state
   */
  @Input() data: DataModel = new DataModel();

  /**
   * Prime details
   */
  @Input() prime: PrimeModel = new PrimeModel();

  /**
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether wallet is opted into prime asset
   */
  isOptedIn: boolean = false;

  /**
   * Whether prime asset is owned by current wallet
   */
  isPrimeOwner: boolean = false;

  /**
   * Whether prime is listed by current wallet
   */
  isSeller: boolean = false;

  /**
   * Manage inputs
   */
  inputs = {
    price: 1000,
  };

  /**
   * Tracking actions
   */
  actions = {
    listPrime: false,
    unlistPrime: false,
    buyPrime: false,
  };

  /**
   * Construct component
   *
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   */
  constructor(
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.refreshView();
  }

  /**
   * Component parameters changed
   */
  ngOnChanges() {
    this.refreshView();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {
      this.isConnected = this.app.account ? true : false;
      this.isOptedIn = this.app.assets.find(a => a.id == this.prime.prime_asset_id) ? true : false;
      this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;
      this.isSeller = this.prime.seller == this.app.account ? true : false;
    }
  }

  /**
   * List prime
   */
  listPrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let listContract: any = null;
    let listContractId = 0;

    if (this.prime.gen == 1) {
      listContract = new baseClient.ABIContract(GenOnePrimeListContract);
      listContractId = environment.gen1.contracts.prime.list.application_id;
    } else {
      listContract = new baseClient.ABIContract(GenTwoPrimeListContract);
      listContractId = environment.gen2.contracts.prime.list.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: listContractId,
        method: this.chainHelper.getMethod(listContract, 'list'),
        methodArgs: [
          Number(this.inputs.price) * Math.pow(10, 6),
          this.prime.application_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.application_address,
          assetIndex: this.prime.prime_asset_id,
          amount: 1,
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.listPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.listPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Listed prime successfully');
        }
      });
    });
  }

  /**
   * Unlist prime
   */
  unlistPrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let unlistContract: any = null;
    let unlistContractId = 0;

    if (this.prime.gen == 1) {
      unlistContract = new baseClient.ABIContract(GenOnePrimeUnlistContract);
      unlistContractId = environment.gen1.contracts.prime.unlist.application_id;
    } else {
      unlistContract = new baseClient.ABIContract(GenTwoPrimeUnlistContract);
      unlistContractId = environment.gen2.contracts.prime.unlist.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.app.account,
            assetIndex: this.prime.prime_asset_id,
            amount: 0,
            suggestedParams: {
              ...params,
              fee: 1000,
              flatFee: true
            }
          })
        });
      }

      composer.addMethodCall({
        sender: this.app.account,
        appID: unlistContractId,
        method: this.chainHelper.getMethod(unlistContract, 'unlist'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id
        ],
        suggestedParams: {
          ...params,
          fee: 3000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.unlistPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.unlistPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Unlisted prime successfully');
        }
      });
    });
  }

  /**
   * Buy prime
   */
  buyPrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let buyContract: any = null;
    let buyContractId = 0;

    if (this.prime.gen == 1) {
      buyContract = new baseClient.ABIContract(GenOnePrimeBuyContract);
      buyContractId = environment.gen1.contracts.prime.buy.application_id;
    } else {
      buyContract = new baseClient.ABIContract(GenTwoPrimeBuyContract);
      buyContractId = environment.gen2.contracts.prime.buy.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.app.account,
            assetIndex: this.prime.prime_asset_id,
            amount: 0,
            suggestedParams: {
              ...params,
              fee: 1000,
              flatFee: true
            }
          })
        });
      }

      composer.addMethodCall({
        sender: this.app.account,
        appID: buyContractId,
        method: this.chainHelper.getMethod(buyContract, 'buy'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id
        ],
        suggestedParams: {
          ...params,
          fee: 3000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.seller,
          amount: Math.floor(this.prime.price * 0.9),
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      if (this.prime.gen == 1) {
        composer.addTransaction({
          txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: environment.admin_address,
            amount: Math.floor(this.prime.price * 0.1),
            suggestedParams: {
              ...params,
              fee: 1000,
              flatFee: true
            }
          })
        });
      } else {
        composer.addTransaction({
          txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: environment.admin_address,
            amount: Math.floor(this.prime.price * 0.05),
            suggestedParams: {
              ...params,
              fee: 1000,
              flatFee: true
            }
          })
        });

        composer.addTransaction({
          txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.prime.parent_application_address,
            amount: Math.floor(this.prime.price * 0.05),
            suggestedParams: {
              ...params,
              fee: 1000,
              flatFee: true
            }
          })
        });
      }

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.buyPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.buyPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Bought prime successfully');
        }
      });
    });
  }
}
