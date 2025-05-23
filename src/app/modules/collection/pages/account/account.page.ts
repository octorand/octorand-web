import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, BadgeHelper, DataHelper, StoreHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class CollectionAccountPage implements OnInit, OnDestroy {

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
   * Selected generation
   */
  selectedGen: number = 1;

  /**
   * Selected sort
   */
  selectedSort: string = 'Id';

  /**
   * Selected list of badges
   */
  selectedBadges: Array<string> = [];

  /**
   * Keys for sorting
   */
  sorts: Array<string> = [
    'Id',
    'Name',
    'Rank',
    'Rewards',
    'Price',
  ];

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
    this.initStore();
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
   * Initialize store
   */
  initStore() {
    let store = this.storeHelper.getDefaultState();
    this.selectedGen = store.account_gen;
    this.selectedSort = store.account_sort;
    this.selectedBadges = store.account_badges;
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
      if (this.app.address) {
        let allResults = [];
        if (this.selectedGen == 1) {
          allResults = this.data.gen_one_primes;
        } else {
          allResults = this.data.gen_two_primes;
        }

        let assets = this.app.assets.filter(a => a.amount > 0).map(a => a.id);
        allResults = allResults.filter(x => assets.includes(x.legacy_asset_id) || assets.includes(x.prime_asset_id) || x.seller == this.app.address);

        if (this.selectedBadges.length > 0) {
          allResults = allResults.filter(x => this.selectedBadges.every(b => x.badges.includes(b)))
        }

        switch (this.selectedSort) {
          case 'Id':
            allResults.sort((first, second) => first.id - second.id);
            break;
          case 'Name':
            allResults.sort((first, second) => first.name.localeCompare(second.name));
            break;
          case 'Rank':
            allResults.sort((first, second) => first.rank - second.rank);
            break;
          case 'Rewards':
            allResults.sort((first, second) => second.rewards - first.rewards);
            break;
          case 'Price':
            allResults.sort((first, second) => {
              function value(price: number) {
                return price == 0 ? Infinity : price;
              }
              return value(first.price) - value(second.price);
            });
            break;
        }

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
   * When gen is changed
   *
   * @param gen
   */
  changeGen(gen: number) {
    this.selectedGen = gen;
    this.currentPage = 1;
    this.refreshView();
    this.storeHelper.setAccountGen(this.selectedGen);
  }

  /**
   * When sort is changed
   *
   * @param sort
   */
  changeSort(sort: string) {
    this.selectedSort = sort;
    this.currentPage = 1;
    this.refreshView();
    this.storeHelper.setAccountSort(this.selectedSort);
  }

  /**
   * When badge is changed
   *
   * @param badge
   */
  changeBadge(badge: string) {
    if (this.selectedBadges.includes(badge)) {
      this.selectedBadges = this.selectedBadges.filter(b => b != badge);
    } else {
      this.selectedBadges.push(badge);
    }
    this.currentPage = 1;
    this.refreshView();
    this.storeHelper.setAccountBadges(this.selectedBadges);
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
