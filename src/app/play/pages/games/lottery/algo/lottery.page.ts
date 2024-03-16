import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { LotteryAlgoModel } from '@app/play/models';
import { LotteryAlgoService } from '@app/play/services';

@Component({
  selector: 'app-play-games-lottery-algo',
  templateUrl: './lottery.page.html',
  styleUrls: ['./lottery.page.scss'],
})
export class PlayGamesLotteryAlgoPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: any = null;

  /**
   * Game definition
   */
  gameDefinition: any = null;

  /**
   * Games list
   */
  gamesList: Array<LotteryAlgoModel> = [];

  /**
   * Track games loading task
   */
  gamesListLoadTask: any = null;

  /**
   * Track games refreshing task
   */
  gamesListRefreshTask: any = null;

  /**
   * Selected filter
   */
  selectedFilter: string = 'All games';

  /**
   * Selectable filter values
   */
  filters = [
    'All games',
    'Games you played',
    'Games you manage',
  ];

  /**
   * Tracking actions
   */
  actions = {
    loadingGames: true
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
   * @param chainHelper
   * @param LotteryAlgoService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private LotteryAlgoService: LotteryAlgoService
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
    clearInterval(this.gamesListLoadTask);
    clearInterval(this.gamesListRefreshTask);
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appHelper.app.subscribe((value: any) => {
      this.app = value;
      this.loadGamesList();
    });

    this.gameDefinition = this.LotteryAlgoService.getDefinition();
  }

  /**
   * Initialize tasks
   */
  initTasks() {
    this.loadGamesList();
    this.gamesListLoadTask = setInterval(() => { this.loadGamesList() }, 30000);

    this.refreshGamesList();
    this.gamesListRefreshTask = setInterval(() => { this.refreshGamesList() }, 1000);
  }

  /**
   * Load games list
   */
  loadGamesList() {
    this.loading = true;

    let promises = [
      this.chainHelper.lookupAccountCreatedApplications(this.gameDefinition.mainAppAddress)
    ];

    if (this.app.account) {
      promises.push(
        this.chainHelper.lookupAccount(this.app.account)
      );
    }

    Promise.all(promises).then((values: Array<any>) => {
      let applications = values[0];
      let account = values[1];

      let gamesList = this.LotteryAlgoService.list(applications);

      let optedInList: Array<number> = [];
      if (this.app.account) {
        let states = account['apps-local-state'];
        if (states) {
          for (let i = 0; i < states.length; i++) {
            optedInList.push(Number(states[i]['id']));
          }
        }
      }

      switch (this.selectedFilter) {
        case 'All games':
          this.gamesList = gamesList;
          break;
        case 'Games you played':
          this.gamesList = gamesList.filter(g => optedInList.includes(g.id));
          break;
        case 'Games you manage':
          this.gamesList = gamesList.filter(g => g.storage.manager == this.app.account);
          break;
      }

      this.actions.loadingGames = false;
      this.loading = false;
    });
  }

  /**
   * Refresh games list
   */
  refreshGamesList() {
    if (!this.actions.loadingGames) {
      for (let i = 0; i < this.gamesList.length; i++) {
        this.gamesList[i] = this.LotteryAlgoService.refresh(this.gamesList[i]);
      }

      this.gamesList.sort((first, second) => second.sortKey - first.sortKey);
    }
  }

  /**
   * Change filter value
   */
  changeFilter(filter: string) {
    this.selectedFilter = filter;
    this.loadGamesList();
    this.hideFilterDropdown();
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }

  /**
   * Hide the filter dropdown
   */
  hideFilterDropdown() {
    let dropdown = document.querySelector('.filter-dropdown');
    if (dropdown) {
      dropdown.classList.remove('show');

      let button = dropdown.querySelector('.btn');
      if (button) {
        button.classList.remove('active');
      }
    }
  }
}
