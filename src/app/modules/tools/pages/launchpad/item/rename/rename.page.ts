import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-tools-launchpad-item-rename',
  templateUrl: './rename.page.html',
  styleUrls: ['./rename.page.scss'],
})
export class ToolsLaunchpadItemRenamePage implements OnInit, OnChanges {

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
   * Manage inputs
   */
  inputs = {
    name: '',
  };

  /**
   * Tracking actions
   */
  actions = {
    renameItem: false,
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
    }
  }

  /**
   * Rename item
   */
  renameItem() {
    if (!this.inputs.name) {
      this.appHelper.showError('Please enter the new name');
      return;
    }

    if (this.inputs.name.length > 16) {
      this.appHelper.showError('Name must be less than 16 characters');
      return;
    }

    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let renameContract: any = new baseClient.ABIContract(this.collection.abis.rename);
    let renameContractId = this.collection.contracts.item.rename.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.address,
        appID: renameContractId,
        method: this.chainHelper.getMethod(renameContract, 'rename'),
        methodArgs: [
          this.chainHelper.getBytes(this.inputs.name, 16),
          this.item.application_id,
        ],
        appForeignAssets: [
          this.item.item_asset_id
        ],
        suggestedParams: {
          ...params,
          fee: 5000,
          flatFee: true
        }
      });

      composer.addTransaction({
        sender: this.app.address,
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: environment.burner.app_address,
          assetIndex: this.collection.platform_asset_id,
          amount: Math.floor(this.collection.rename_price * this.collection.rename_burner_share / 100),
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      composer.addTransaction({
        sender: this.app.address,
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: this.collection.treasury_address,
          assetIndex: this.collection.platform_asset_id,
          amount: Math.floor(this.collection.rename_price * this.collection.rename_treasury_share / 100),
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      composer.addTransaction({
        sender: this.app.address,
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: environment.admin_address,
          assetIndex: this.collection.platform_asset_id,
          amount: Math.floor(this.collection.rename_price * this.collection.rename_admin_share / 100),
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

      this.actions.renameItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.renameItem = false;
        if (response.success) {
          this.launchpadHelper.loadItemDetails();
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Renamed item successfully');
        }
      });
    });
  }
}
