import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, BadgeHelper, DataHelper, StoreHelper } from '@lib/helpers';
import { AppModel, DataModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-traits',
  templateUrl: './traits.page.html',
  styleUrls: ['./traits.page.scss'],
})
export class PlatformTraitsPage implements OnInit, OnDestroy {

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
   * List of badges
   */
  badges: Array<any> = [];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param badgeHelper
   * @param dataHelper
   * @param storeHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private badgeHelper: BadgeHelper,
    private dataHelper: DataHelper,
    private storeHelper: StoreHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initData();
    this.initBadges();
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
   * Initialize badges
   */
  initBadges() {
    this.badges = this.badgeHelper.list();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.data && this.data.initialised) {
      let primesOne = this.data.gen_one_primes;
      let primesTwo = this.data.gen_two_primes;

      for (let i = 0; i < this.badges.length; i++) {
        this.badges[i].count_one = primesOne.filter(p => p.badges.includes(this.badges[i].name)).length;
        this.badges[i].percentage_one = Math.floor(this.badges[i].count_one * 100 / primesOne.length);
        this.badges[i].count_two = primesTwo.filter(p => p.badges.includes(this.badges[i].name)).length;
        this.badges[i].percentage_two = Math.floor(this.badges[i].count_two * 100 / primesTwo.length);
      }

      this.ready = true;
    }
  }

  /**
   * Open badge details page
   *
   * @param gen
   * @param badge
   */
  openBadge(gen: number, badge: any) {
    this.storeHelper.setBrowseGen(gen);
    this.storeHelper.setBrowseBadges([badge.name]);
    this.storeHelper.setBrowseSort('Rank');
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
