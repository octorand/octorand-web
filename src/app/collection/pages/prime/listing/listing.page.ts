import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';

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
   * Tracking actions
   */
  actions = {
    optinToAsset: false
  };

  /**
   * Construct component
   *
   * @param appHelper
   * @param chainHelper
   */
  constructor(
    private appHelper: AppHelper,
    private chainHelper: ChainHelper
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
   * Optin to prime asset
   */
  optinToAsset() {
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

      this.actions.optinToAsset = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.optinToAsset = false;
        if (response.success) {
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Opted into prime asset successfully');
        }
      });
    });
  }
}
