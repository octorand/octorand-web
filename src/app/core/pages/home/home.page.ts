import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-core-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class CoreHomePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: any = null;

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
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
    this.appSubscription = this.appHelper.app.subscribe((value: any) => {
      this.app = value;
    });
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
