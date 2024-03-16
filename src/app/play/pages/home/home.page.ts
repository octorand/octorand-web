import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';

@Component({
  selector: 'app-play-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class PlayHomePage implements OnInit {

  /**
   * App state
   */
  app: any = null;

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
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appHelper.app.subscribe((value: any) => {
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
