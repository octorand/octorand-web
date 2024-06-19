import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection-prime',
  templateUrl: './prime.page.html',
  styleUrls: ['./prime.page.scss'],
})
export class CollectionPrimePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * Data state
   */
  data: DataModel = new DataModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Data subscription
   */
  dataSubscription: Subscription = new Subscription();

  /**
   * Prime details
   */
  prime: PrimeModel = new PrimeModel();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether wallet is opted into prime asset
   */
  isOptedIn: boolean = false;

  /**
   * Whether wallet is the owner of prime asset
   */
  isPrimeOwner: boolean = false;

  /**
   * Whether wallet is the owner of legacy asset
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
   * @param activatedRoute
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initData();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
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
   * Initialize data
   */
  initData() {
    this.data = this.dataHelper.getDefaultState();
    this.dataSubscription = this.dataHelper.data.subscribe((value: DataModel) => {
      this.data = value;
      this.refreshView();
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.data && this.data.initialised) {
      let gen = Number(this.activatedRoute.snapshot.params['gen'].replace(/\D/g, ''));
      let id = Number(this.activatedRoute.snapshot.params['id']);

      if (gen == 1) {
        let prime = this.data.gen_one_primes.find(p => p.id == id);
        if (prime) {
          this.prime = prime;
        }
      } else {
        let prime = this.data.gen_two_primes.find(p => p.id == id);
        if (prime) {
          this.prime = prime;
        }
      }

      if (this.prime) {
        this.isConnected = this.app.account ? true : false;
        this.isOptedIn = this.app.assets.find(a => a.id == this.prime.prime_asset_id) ? true : false;
        this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;
        this.isLegacyOwner = this.app.assets.find(a => a.id == this.prime.legacy_asset_id && a.amount > 0) ? true : false;
        this.ready = true;
      }
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

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }
}
