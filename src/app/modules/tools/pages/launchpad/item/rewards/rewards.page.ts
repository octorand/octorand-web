import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';

@Component({
  selector: 'app-tools-launchpad-item-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class ToolsLaunchpadItemRewardsPage implements OnInit, OnChanges {

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
   * Whether item asset is owned by current wallet
   */
  isItemOwner: boolean = false;

  /**
   * Whether item asset is listed for sale by current wallet
   */
  isListedOwner: boolean = false;

  /**
   * Whether current wallet is opted into platform asset
   */
  isOptedIn: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    mintItem: false
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
      this.isItemOwner = this.app.assets.find(a => a.id == this.item.item_asset_id && a.amount > 0) ? true : false;
      this.isListedOwner = (this.item.is_listed && this.item.seller == this.app.address) ? true : false;
      this.isOptedIn = this.app.assets.find(a => a.id == this.item.platform_asset_id) ? true : false;
    }
  }

  /**
   * Mint item rewards
   */
  mintItem() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let mintContract: any = new baseClient.ABIContract(this.collection.abis.mint);
    let mintContractId = this.collection.contracts.item.mint.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.address,
            to: this.app.address,
            assetIndex: this.item.platform_asset_id,
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
        sender: this.app.address,
        appID: mintContractId,
        method: this.chainHelper.getMethod(mintContract, 'mint'),
        methodArgs: [
          this.item.rewards,
          this.item.application_id,
        ],
        appForeignAssets: [
          this.item.item_asset_id,
          this.item.platform_asset_id
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

      this.actions.mintItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.mintItem = false;
        if (response.success) {
          this.launchpadHelper.loadItemDetails();
          this.appHelper.showSuccess('Rewards withdrawn successfully');
        }
      });
    });
  }
}
