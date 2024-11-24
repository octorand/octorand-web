import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, GameHelper } from '@lib/helpers';
import { AppModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-spell-seeker',
  templateUrl: './spell-seeker.page.html',
  styleUrls: ['./spell-seeker.page.scss'],
})
export class PlatformGamesSpellSeekerPage implements OnInit, OnDestroy {

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
   * Game information
   */
  game: any = {};

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
    private gameHelper: GameHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initGame();
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
  initGame() {
    this.game = this.gameHelper.find('spell-seeker');
  }

  /**
   * Refresh view state
   */
  refreshView() {
    this.ready = true;
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
