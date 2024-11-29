import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';
import { AppModel, PlayerModel } from '@lib/models';
import { AuthService } from '@lib/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-redeem',
  templateUrl: './redeem.page.html',
  styleUrls: ['./redeem.page.scss'],
})
export class PlatformGamesRedeemPage implements OnInit, OnDestroy {

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
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param authService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
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
