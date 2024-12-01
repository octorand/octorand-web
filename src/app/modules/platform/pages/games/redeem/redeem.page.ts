import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';
import { AppModel, PlayerModel } from '@lib/models';
import { AuthService, RedeemService } from '@lib/services';
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
   * Manage inputs
   */
  inputs = {
    prime_generation: 1,
    prime_position: 0,
    stars: 10,
  };

  /**
   * Tracking actions
   */
  actions = {
    redeemStars: false,
  };

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param authService
   * @param redeemService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private authService: AuthService,
    private redeemService: RedeemService
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
   * Redeem stars
   */
  async redeemStars() {
    if (!this.inputs.stars) {
      this.appHelper.showError('Please enter the stars to redeem');
      return;
    }

    if (Number.isNaN(this.inputs.stars)) {
      this.appHelper.showError('Please enter the stars to redeem');
      return;
    }

    if (this.inputs.stars < 1) {
      this.appHelper.showError('Stars to redeem must be greater than 1');
      return;
    }

    if (!Number.isInteger(this.inputs.stars)) {
      this.appHelper.showError('Stars to redeem must not be a decimal number');
      return;
    }

    if (this.player.stars < this.inputs.stars) {
      this.appHelper.showError('You do not have enough stars to redeem');
      return;
    }

    this.actions.redeemStars = true;

    await this.redeemService.process(this.inputs.prime_generation, this.inputs.prime_position, this.inputs.stars, 'score');
    await this.refreshPlayer();

    this.actions.redeemStars = false;
    this.appHelper.showSuccess('Stars redeemed successfully');
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
