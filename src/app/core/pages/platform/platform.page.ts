import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';
import { PlatformTokenomicsService, PlatformTreasuryService } from '@app/core/services';

@Component({
  selector: 'app-core-platform',
  templateUrl: './platform.page.html',
  styleUrls: ['./platform.page.scss'],
})
export class CorePlatformPage implements OnInit {

  /**
   * App state
   */
  app: any = null;

  /**
   * List of platform links
   */
  platforms: Array<any> = [];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param platformTreasuryService
   * @param platformTokenomicsService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private platformTreasuryService: PlatformTreasuryService,
    private platformTokenomicsService: PlatformTokenomicsService
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

    this.platforms = [
      this.platformTokenomicsService.getDefinition(),
      this.platformTreasuryService.getDefinition(),
    ];
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
