import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, GenOnePrimeModel } from '@lib/models';
import { GenOnePrimeService } from '@lib/services';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-core-browse-gen1',
  templateUrl: './gen1.page.html',
  styleUrls: ['./gen1.page.scss'],
})
export class CoreBrowseOnePage implements OnInit, OnDestroy {

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
  currentPageResults: Array<GenOnePrimeModel> = [];

  /**
   * Sort by key
   */
  sortBy: string = 'Id';

  /**
   * Keys for sorting
   */
  sortKeys: Array<string> = [
    'Id',
    'Name',
    'Rank',
  ];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   * @param genOnePrimeService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper,
    private genOnePrimeService: GenOnePrimeService
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
    this.chainHelper.lookupAccountCreatedApplications(environment.gen1.manager_address).then((applications: any) => {
      let primes = this.genOnePrimeService.list(applications);
      this.dataHelper.setGenOnePrimes(primes);
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.data) {
      let allResults = this.data.genOnePrimes;

      switch (this.sortBy) {
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
   * When sort key is changed
   *
   * @param sort
   */
  changeSortBy(sort: string) {
    this.sortBy = sort;
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
