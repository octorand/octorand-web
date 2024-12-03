import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AppHelper } from '@lib/helpers';
import { AppModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-play-spell-seeker',
  templateUrl: './spell-seeker.page.html',
  styleUrls: ['./spell-seeker.page.scss'],
})
export class PlatformGamesPlaySpellSeekerPage implements OnInit, OnDestroy {

  /**
   * Fired when account details changed
   */
  @Output() accountUpdated = new EventEmitter<any>();

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
   * Construct component
   *
   * @param appHelper
   */
  constructor(
    private appHelper: AppHelper
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
    this.ready = true;
  }

  /**
   * Refresh account details
   *
   * @param page
   */
  updateAccount() {
    this.accountUpdated.emit();
  }
}
