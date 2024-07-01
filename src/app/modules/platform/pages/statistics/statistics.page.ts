import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, DataHelper, StoreHelper } from '@lib/helpers';
import { AppModel, DataModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
})
export class PlatformStatisticsPage implements OnInit, OnDestroy {

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
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Details of prime generations
   */
  generations: Array<any> = [];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param dataHelper
   * @param storeHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private dataHelper: DataHelper,
    private storeHelper: StoreHelper
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
      let primesOne = this.data.gen_one_primes;
      let primesTwo = this.data.gen_two_primes;

      let genOne = {
        id: 1,
        name: 'GEN1',
        count: primesOne.length,
        owners: (new Set(primesOne.map(p => p.owner))).size,
        listed: primesOne.filter(p => p.price > 0).length,
        sales: 0,
        volume: 0,
        highest: 0
      };

      let genTwo = {
        id: 2,
        name: 'GEN2',
        count: primesTwo.length,
        owners: (new Set(primesTwo.map(p => p.owner))).size,
        listed: primesTwo.filter(p => p.price > 0).length,
        sales: 0,
        volume: 0,
        highest: 0
      };

      this.generations = [
        genOne,
        genTwo,
      ];

      this.ready = true;
    }
  }

  /**
   * Open browse primes page
   *
   * @param gen
   */
  openGen(gen: number) {
    this.storeHelper.setBrowseGen(gen);
    this.storeHelper.setBrowseBadges([]);
    this.storeHelper.setBrowseSort('Id');
    this.navigateToPage('/collection/browse');
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
