import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, GameHelper } from '@lib/helpers';
import { AppModel, PlayerModel } from '@lib/models';
import { AuthService } from '@lib/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class PlatformGamesPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * List of games
   */
  games: Array<any> = [];

  /**
   * Player information
   */
  player: PlayerModel = new PlayerModel();

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param gameHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private gameHelper: GameHelper,
    private authService: AuthService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initGames();
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
   * Initialize games
   */
  initGames() {
    this.games = this.gameHelper.list();
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
        this.resetPlayer();
      }
    } else {
      this.resetPlayer();
    }

    this.ready = true;
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
   * Reset player status
   */
  resetPlayer() {
    this.player = new PlayerModel();
  }

  /**
   * Open play game page
   *
   * @param id
   */
  playGame(id: string) {
    this.navigateToPage('/platform/games/play/' + id);
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
