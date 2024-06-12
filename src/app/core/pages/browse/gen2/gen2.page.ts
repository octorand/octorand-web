import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, GenTwoPrimeModel } from '@lib/models';
import { GenTwoPrimeService } from '@lib/services';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-core-browse-gen2',
  templateUrl: './gen2.page.html',
  styleUrls: ['./gen2.page.scss'],
})
export class CoreBrowseTwoPage implements OnInit, OnDestroy {

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
   * Track prime details loading task
   */
  primeDetailsLoadTask: any = null;

  /**
   * Current page number
   */
  currentPage: number = 1;

  /**
   * Number of results per page
   */
  resultsPerPage: number = 100;

  /**
   * Total number of results
   */
  totalResults: number = 0;

  /**
   * Total number of pages
   */
  pagesCount: number = 0;

  /**
   * Results in the current page
   */
  currentPageResults: Array<GenTwoPrimeModel> = [];

  /**
   * Sort sort
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
  ];

  /**
   * List of badges
   */
  badges: Array<string> = [
    'Artifact',
    'Bountiful',
    'Chameleon',
    'Changeling',
    'Culture',
    'Drained',
    'Equidistant',
    'Exotic',
    'Explorer',
    'Family',
    'Fancy',
    'Fiction',
    'Flipper',
    'Founder',
    'Phrase',
    'Pioneer',
    'Pristine',
    'Shapeshifter',
    'Straight',
    'Wordsmith',
  ];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   * @param genTwoPrimeService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper,
    private genTwoPrimeService: GenTwoPrimeService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initData();
    this.initTasks();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    clearInterval(this.primeDetailsLoadTask);
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
   * Initialize tasks
   */
  initTasks() {
    this.loadPrimeDetails();
    this.primeDetailsLoadTask = setInterval(() => { this.loadPrimeDetails() }, 30000);
  }

  /**
   * Load prime details
   */
  loadPrimeDetails() {
    this.chainHelper.lookupAccountCreatedApplications(environment.gen2.manager_address).then((applications: any) => {
      let primes = this.genTwoPrimeService.list(applications);
      this.dataHelper.setGenTwoPrimes(primes);
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.data) {
      let allResults = this.data.genTwoPrimes;

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
      }

      let totalResults = allResults.length;
      let pagesCount = Math.ceil(totalResults / this.resultsPerPage);

      let start = this.resultsPerPage * (this.currentPage - 1);
      let end = start + this.resultsPerPage;
      let currentPageResults = allResults.slice(start, end);

      this.totalResults = totalResults;
      this.pagesCount = pagesCount;
      this.currentPageResults = currentPageResults;
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
   * When sort is changed
   *
   * @param sort
   */
  changeSort(sort: string) {
    this.selectedSort = sort;
    this.currentPage = 1;
    this.refreshView();
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
