import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { environment } from '@environment';

@Component({
  selector: 'app-core-browse-one',
  templateUrl: './one.page.html',
  styleUrls: ['./one.page.scss'],
})
export class CoreBrowseOnePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: any = null;

  /**
   * Track token details loading task
   */
  tokenDetailsLoadTask: any = null;

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
    clearInterval(this.tokenDetailsLoadTask);
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
    this.loadTokenDetails();
    this.tokenDetailsLoadTask = setInterval(() => { this.loadTokenDetails() }, 30000);
  }

  /**
   * Load token details
   */
  loadTokenDetails() {
    this.loading = true;
    // this.assetId = environment.platform_asset_id;
    // this.chainHelper.lookupAsset(environment.platform_asset_id).then((asset: any) => {
    //   this.totalSupply = asset['params']['total'];
    //   this.chainHelper.lookupAccount(environment.burner_address).then((account: any) => {
    //     let balance = account['assets'].find((a: any) => a['asset-id'] == asset.index);
    //     if (balance) {
    //       this.burntSupply = balance.amount;
    //     }

    //     this.remainingSupply = this.totalSupply - this.burntSupply;
    //     this.actions.loadingDetails = false;
    //     this.loading = false;
    //   });
    // });
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
