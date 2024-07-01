import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenOnePrimeUpgradeContract, GenTwoPrimeUpgradeContract } from '@lib/contracts';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-upgrade',
  templateUrl: './upgrade.page.html',
  styleUrls: ['./upgrade.page.scss'],
})
export class PlatformUpgradePage implements OnInit, OnDestroy {

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
   * Current page number
   */
  currentPage: number = 1;

  /**
   * Number of results per page
   */
  resultsPerPage: number = environment.display_page_size;

  /**
   * Total number of results
   */
  totalResults: number = 0;

  /**
   * Total number of pages
   */
  pagesCount: number = 0;

  /**
   * Results of current page
   */
  currentPageResults: Array<PrimeModel> = [];

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    upgradePrime: ''
  };

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   */
  constructor(
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
      if (this.app.account) {
        let allResults = [
          ...this.data.gen_one_primes,
          ...this.data.gen_two_primes
        ];

        let assets = this.app.assets.filter(a => a.amount > 0).map(a => a.id);
        allResults = allResults.filter(x => assets.includes(x.legacy_asset_id));

        allResults.sort((first, second) => 10000 + first.id - second.id);

        let totalResults = allResults.length;
        let pagesCount = Math.ceil(totalResults / this.resultsPerPage);

        let start = this.resultsPerPage * (this.currentPage - 1);
        let end = start + this.resultsPerPage;
        let currentPageResults = allResults.slice(start, end);

        this.totalResults = totalResults;
        this.pagesCount = pagesCount;
        this.currentPageResults = currentPageResults;
      } else {
        this.totalResults = 0;
        this.pagesCount = 0;
        this.currentPageResults = [];
      }

      if (this.currentPage > this.pagesCount) {
        this.currentPage = 1;
      }

      this.ready = true;
    }
  }

  /**
   * When page is changed
   *
   * @param page
   */
  changePage(page: any) {
    this.currentPage = page;
    this.refreshView();
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }

  /**
   * Upgrade prime
   */
  upgradePrime(prime: any) {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let upgradeContract: any = null;
    let upgradeContractId = 0;

    if (prime.gen == 1) {
      upgradeContract = new baseClient.ABIContract(GenOnePrimeUpgradeContract);
      upgradeContractId = environment.gen1.contracts.prime.upgrade.application_id;
    } else {
      upgradeContract = new baseClient.ABIContract(GenTwoPrimeUpgradeContract);
      upgradeContractId = environment.gen2.contracts.prime.upgrade.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      let isOptedIn = this.app.assets.find(a => a.id == prime.prime_asset_id) ? true : false;

      if (!isOptedIn) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.app.account,
            assetIndex: prime.prime_asset_id,
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
        appID: upgradeContractId,
        method: this.chainHelper.getMethod(upgradeContract, 'upgrade'),
        methodArgs: [
          prime.application_id,
        ],
        appForeignAssets: [
          prime.prime_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 3000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: prime.application_address,
          assetIndex: prime.legacy_asset_id,
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

      this.actions.upgradePrime = prime.id_text;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.upgradePrime = '';
        if (response.success) {
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Upgraded prime successfully');
        }
      });
    });
  }
}
