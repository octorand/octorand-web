import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, IndexerHelper } from '@lib/helpers';
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
  remainingSupply: number = 0;

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Track token details loading task
   */
  private tokenDetailsLoadTask: any = null;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param indexerHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private indexerHelper: IndexerHelper
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
    this.appSubscription.unsubscribe();
    clearInterval(this.tokenDetailsLoadTask);
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appSubscription = this.appHelper.app.subscribe((value: AppModel) => {
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
    this.assetId = environment.platform.asset_id;
    this.indexerHelper.lookupAsset(this.assetId).then((asset: any) => {
      this.assetUnit = asset['params']['unit-name'];
      this.assetDecimals = asset['params']['decimals'];
      this.totalSupply = asset['params']['total'];

      this.indexerHelper.lookupAccount(environment.platform.reserve).then((account: any) => {
        let balance = account['assets'].find((a: any) => a['asset-id'] == this.assetId);
        if (balance) {
          this.burntSupply = balance.amount;
        }

        this.remainingSupply = this.totalSupply - this.burntSupply;
        this.ready = true;
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
