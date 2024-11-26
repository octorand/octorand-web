import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, ChainHelper, IndexerHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-tools-launchpad-tokenomics',
  templateUrl: './tokenomics.page.html',
  styleUrls: ['./tokenomics.page.scss'],
})
export class ToolsLaunchpadTokenomicsPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * Launchpad state
   */
  launchpad: LaunchpadModel = new LaunchpadModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Launchpad subscription
   */
  launchpadSubscription: Subscription = new Subscription();

  /**
   * Collection details
   */
  collection: CollectionModel = new CollectionModel();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Token id
   */
  assetId: number = 0;

  /**
   * Token unit
   */
  assetUnit: string = '';

  /**
   * Token decimals
   */
  assetDecimals: number = 0;

  /**
   * Token burner
   */
  assetBurner: string = '';

  /**
   * Total supply of token
   */
  totalSupply: number = 0;

  /**
   * Burnt supply of token
   */
  burntSupply: number = 0;

  /**
   * Current supply of token
   */
  circulatingSupply: number = 0;

  /**
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether wallet is opted into platform asset
   */
  isOptedIn: boolean = false;

  /**
   * Whether item is optinable
   */
  isOptinable: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    optin: false,
  };

  /**
   * Construct component
   *
   * @param activatedRoute
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param indexerHelper
   * @param launchpadHelper
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private indexerHelper: IndexerHelper,
    private launchpadHelper: LaunchpadHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initLaunchpad();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.launchpadSubscription.unsubscribe();
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appSubscription = this.appHelper.app.subscribe((value: AppModel) => {
      this.app = value;
      this.refreshView();
    });
  }

  /**
   * Initialize launchpad
   */
  initLaunchpad() {
    this.launchpad = this.launchpadHelper.getDefaultState();
    this.launchpadSubscription = this.launchpadHelper.launchpad.subscribe((value: LaunchpadModel) => {
      this.launchpad = value;
      this.refreshView();
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.launchpad && this.launchpad.initialised) {
      let collection_id = this.activatedRoute.snapshot.params['collection_id'];
      let collection = this.launchpad.collections.find(x => x.id == collection_id);

      if (collection) {
        this.collection = collection;

        this.assetId = this.collection.platform_asset_id;
        this.assetBurner = environment.burner.app_address;

        this.isConnected = this.app.address ? true : false;
        this.isOptedIn = this.app.assets.find(a => a.id == this.assetId) ? true : false;
        this.isOptinable = (this.isConnected && !this.isOptedIn) ? true : false;

        this.loadTokenDetails();

        this.ready = true;
      } else {
        this.navigateToPage('/tools/launchpad');
      }
    }
  }

  /**
   * Load token details
   */
  loadTokenDetails() {
    let promises = [
      this.indexerHelper.lookupAsset(this.assetId),
      this.indexerHelper.lookupAccount(this.assetBurner),
    ];

    Promise.all(promises).then(values => {
      let asset = values[0];
      let account = values[1];

      this.assetUnit = asset['params']['unit-name'];
      this.assetDecimals = asset['params']['decimals'];
      this.totalSupply = asset['params']['total'];

      let balance = account['assets'].find((a: any) => a['asset-id'] == this.assetId);
      if (balance) {
        this.burntSupply = balance.amount;
      }

      this.circulatingSupply = this.totalSupply - this.burntSupply;
    });
  }

  /**
   * Optin to platform asset
   */
  optin() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: this.app.address,
          assetIndex: this.assetId,
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

      this.actions.optin = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.optin = false;
        if (response.success) {
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Opted into asset successfully');
        }
      });
    });
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }
}
