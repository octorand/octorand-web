import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';
import { AppModel, PlayerModel } from '@lib/models';
import { AccountService, AuthService } from '@lib/services';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-games-rankings',
  templateUrl: './rankings.page.html',
  styleUrls: ['./rankings.page.scss'],
})
export class PlatformGamesRankingsPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Player information
   */
  player: PlayerModel = new PlayerModel();

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
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param accountService
   * @param authService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private accountService: AccountService,
    private authService: AuthService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
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
   * Refresh view state
   */
  refreshView() {
    let account = this.appHelper.getAccount();
    if (account) {
      if (account.token) {
        this.refreshPlayer();
      } else {
        this.backToGames();
      }
    } else {
      this.backToGames();
    }

    this.loadRankings();
  }

  /**
   * Load rankings
   */
  async loadRankings() {
    let allResults = await this.accountService.rankings();

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

    this.refreshPlayer();

    this.ready = true;
  }

  /**
   * When page is changed
   *
   * @param page
   */
  changePage(page: any) {
    this.currentPage = page;
    this.loadRankings();
  }

  /**
   * Refresh player status
   */
  async refreshPlayer() {
    let account = await this.authService.account();
    if (account) {
      this.player.id = account.id;
      this.player.address = account.address;
      this.player.hearts = account.hearts;
      this.player.stars = account.stars;
      this.player.ranking = account.ranking;
    }
  }

  /**
   * Open games page
   */
  backToGames() {
    this.navigateToPage('/platform/games');
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
