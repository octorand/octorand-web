import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { environment } from '@environment';

@Component({
  selector: 'app-core-platform-treasury',
  templateUrl: './treasury.page.html',
  styleUrls: ['./treasury.page.scss'],
})
export class CorePlatformTreasuryPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: any = null;

  /**
   * Token id
   */
  assetId = 0;

  /**
   * Current balance of treasury
   */
  currentBalance: number = 0;

  /**
   * Number of tokens burned so far
   */
  totalBurned: number = 0;

  /**
   * Transaction history of burns
   */
  burnsHistory: Array<any> = [];

  /**
   * Track treasury details loading task
   */
  treasuryDetailsLoadTask: any = null;

  /**
   * Tracking actions
   */
  actions = {
    loadingDetails: true
  };

  /**
   * True if data loading is going on
   */
  loading: boolean = true;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initTasks();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    clearInterval(this.treasuryDetailsLoadTask);
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appHelper.app.subscribe((value: any) => {
      this.app = value;
    });
  }

  /**
   * Initialize tasks
   */
  initTasks() {
    this.loadTreasuryDetails();
    this.treasuryDetailsLoadTask = setInterval(() => { this.loadTreasuryDetails() }, 30000);
  }

  /**
   * Load treasury details
   */
  loadTreasuryDetails() {
    this.loading = true;
    this.assetId = environment.platform_asset_id;
    this.chainHelper.lookupAccount(environment.treasury_address).then((account: any) => {
      this.chainHelper.lookupAssetTransferTransactions(environment.treasury_address, environment.platform_asset_id).then((transactions: Array<any>) => {
        this.currentBalance = account.amount;

        let burnsHistory = transactions.filter(transaction => { return transaction['asset-transfer-transaction']['receiver'] == environment.burner_address });
        burnsHistory.sort((first, second) => second['round-time'] - first['round-time']);

        let totalBurned = 0;
        for (let i = 0; i < burnsHistory.length; i++) {
          totalBurned = totalBurned + burnsHistory[i]['asset-transfer-transaction']['amount'];
        }

        this.burnsHistory = burnsHistory;
        this.totalBurned = totalBurned;

        this.actions.loadingDetails = false;
        this.loading = false;
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
