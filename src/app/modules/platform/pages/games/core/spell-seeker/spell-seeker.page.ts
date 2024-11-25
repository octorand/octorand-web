import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppHelper } from '@lib/helpers';
import { AppModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-core-spell-seeker',
  templateUrl: './spell-seeker.page.html',
  styleUrls: ['./spell-seeker.page.scss'],
})
export class PlatformGamesCoreSpellSeekerPage implements OnInit, OnDestroy {

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
}
