import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';

@Component({
  selector: 'app-tools-launchpad-item-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class ToolsLaunchpadItemSummaryPage implements OnInit, OnChanges {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
   * Launchpad state
   */
  @Input() launchpad: LaunchpadModel = new LaunchpadModel();

  /**
   * Collection details
   */
  @Input() collection: CollectionModel = new CollectionModel();

  /**
   * Item details
   */
  @Input() item: ItemModel = new ItemModel();

  /**
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether wallet is opted into item asset
   */
  isOptedIn: boolean = false;

  /**
   * Whether item asset is owned by current wallet
   */
  isItemOwner: boolean = false;

  /**
   * Whether item is optinable
   */
  isOptinable: boolean = false;

  /**
   * Whether item is claimable
   */
  isClaimable: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    optinItem: false,
    claimItem: false,
  };

  /**
   * Construct component
   *
   * @param appHelper
   * @param chainHelper
   * @param launchpadHelper
   */
  constructor(
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private launchpadHelper: LaunchpadHelper
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
    if (this.item) {
      this.isConnected = this.app.address ? true : false;
      this.isOptedIn = this.app.assets.find(a => a.id == this.item.item_asset_id) ? true : false;
      this.isItemOwner = this.app.assets.find(a => a.id == this.item.item_asset_id && a.amount > 0) ? true : false;
      this.isOptinable = (this.isConnected && !this.isOptedIn) ? true : false;
      this.isClaimable = (this.isItemOwner && this.item.owner != this.app.address) ? true : false;
    }
  }

  /**
   * Optin to item asset
   */
  optinItem() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: this.app.address,
          assetIndex: this.item.item_asset_id,
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

      this.actions.optinItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.optinItem = false;
        if (response.success) {
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Opted into item asset successfully');
        }
      });
    });
  }

  /**
   * Claim item
   */
  claimItem() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let claimContract: any = new baseClient.ABIContract(this.collection.abis.claim);
    let claimContractId = this.collection.contracts.item.claim.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.address,
        appID: claimContractId,
        method: this.chainHelper.getMethod(claimContract, 'claim'),
        methodArgs: [
          this.item.application_id,
        ],
        appForeignAssets: [
          this.item.item_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.claimItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.claimItem = false;
        if (response.success) {
          this.launchpadHelper.loadItemDetails();
          this.appHelper.showSuccess('Claimed item successfully');
        }
      });
    });
  }
}
