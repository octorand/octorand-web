import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-tools-launchpad-item-market',
  templateUrl: './market.page.html',
  styleUrls: ['./market.page.scss'],
})
export class ToolsLaunchpadItemMarketPage implements OnInit, OnChanges {

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
   * Whether item is listed by current wallet
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
    listItem: false,
    unlistItem: false,
    buyItem: false,
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
      this.isOptedIn = this.app.assets.find(a => a.id == this.item.item_asset_id) ? true : false;
      this.isItemOwner = this.app.assets.find(a => a.id == this.item.item_asset_id && a.amount > 0) ? true : false;
      this.isSeller = this.item.seller == this.app.address ? true : false;
    }
  }

  /**
   * List item
   */
  listItem() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let listContract: any = new baseClient.ABIContract(this.collection.abis.list);
    let listContractId = this.collection.contracts.item.list.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.address,
        appID: listContractId,
        method: this.chainHelper.getMethod(listContract, 'list'),
        methodArgs: [
          Number(this.inputs.price) * Math.pow(10, 6),
          this.item.application_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: this.item.application_address,
          assetIndex: this.item.item_asset_id,
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

      this.actions.listItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.listItem = false;
        if (response.success) {
          this.launchpadHelper.loadItemDetails();
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Listed item successfully');
        }
      });
    });
  }

  /**
   * Unlist item
   */
  unlistItem() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let unlistContract: any = new baseClient.ABIContract(this.collection.abis.unlist);
    let unlistContractId = this.collection.contracts.item.unlist.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
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
      }

      composer.addMethodCall({
        sender: this.app.address,
        appID: unlistContractId,
        method: this.chainHelper.getMethod(unlistContract, 'unlist'),
        methodArgs: [
          this.item.application_id,
        ],
        appForeignAssets: [
          this.item.item_asset_id
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

      this.actions.unlistItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.unlistItem = false;
        if (response.success) {
          this.launchpadHelper.loadItemDetails();
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Unlisted item successfully');
        }
      });
    });
  }

  /**
   * Buy item
   */
  buyItem() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let buyContract: any = new baseClient.ABIContract(this.collection.abis.buy);
    let buyContractId = this.collection.contracts.item.buy.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
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
      }

      composer.addMethodCall({
        sender: this.app.address,
        appID: buyContractId,
        method: this.chainHelper.getMethod(buyContract, 'buy'),
        methodArgs: [
          this.item.application_id,
        ],
        appForeignAssets: [
          this.item.item_asset_id
        ],
        suggestedParams: {
          ...params,
          fee: 3000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: this.item.seller,
          amount: Math.floor(this.item.price * this.collection.seller_market_share / 100),
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      composer.addTransaction({
        txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: this.collection.artist_address,
          amount: Math.floor(this.item.price * this.collection.artist_market_share / 100),
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      composer.addTransaction({
        txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: environment.admin_address,
          amount: Math.floor(this.item.price * this.collection.admin_market_share / 100),
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

      this.actions.buyItem = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.buyItem = false;
        if (response.success) {
          this.launchpadHelper.loadItemDetails();
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Bought item successfully');
        }
      });
    });
  }
}
