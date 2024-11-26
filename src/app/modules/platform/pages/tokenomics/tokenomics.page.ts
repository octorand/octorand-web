import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper, IndexerHelper } from '@lib/helpers';
import { AppModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-tokenomics',
  templateUrl: './tokenomics.page.html',
  styleUrls: ['./tokenomics.page.scss'],
})
export class PlatformTokenomicsPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

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
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether wallet is opted into platform asset
   */
  isOptedIn: boolean = false;

  /**
   * Whether prime is optinable
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
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param indexerHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private indexerHelper: IndexerHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
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
   * Refresh view state
   */
  refreshView() {
    this.assetId = environment.platform.asset_id;
    this.assetBurner = environment.platform.reserve;

    this.isConnected = this.app.address ? true : false;
    this.isOptedIn = this.app.assets.find(a => a.id == this.assetId) ? true : false;
    this.isOptinable = (this.isConnected && !this.isOptedIn) ? true : false;

    this.loadTokenDetails();

    this.ready = true;
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
