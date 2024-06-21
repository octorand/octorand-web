import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeListContract, GenTwoPrimeListContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class CollectionPrimeListingPage implements OnInit, OnChanges {

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
   * Whether legacy asset is owned by current wallet
   */
  isLegacyOwner: boolean = false;

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
      this.isLegacyOwner = this.app.assets.find(a => a.id == this.prime.legacy_asset_id && a.amount > 0) ? true : false;
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
      listContractId = environment.gen1.contracts.prime.claim.application_id;
    } else {
      listContract = new baseClient.ABIContract(GenTwoPrimeListContract);
      listContractId = environment.gen2.contracts.prime.claim.application_id;
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
          assetIndex: this.prime.legacy_asset_id,
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

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

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

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

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
