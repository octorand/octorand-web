import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class PlatformLeaderboardPage implements OnInit, OnDestroy {

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
  currentPageResults: Array<any> = [];

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Selected generation
   */
  selectedGen: number = 1;

  /**
   * Selected ranking
   */
  selectedRanking: string = 'Scores';

  /**
   * Keys for rankings
   */
  rankings: Array<string> = [
    'Scores',
  ];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param dataHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
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
      let allResults: Array<any> = [];

      switch (this.selectedRanking) {
        case 'Scores':
          if (this.selectedGen == 1) {
            allResults = this.data.gen_one_primes.sort((first, second) => second.score - first.score);
          } else {
            allResults = this.data.gen_two_primes.sort((first, second) => second.score - first.score);
          }
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
  }

  /**
   * When ranking is changed
   *
   * @param ranking
   */
  changeRanking(ranking: string) {
    this.selectedRanking = ranking;
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
