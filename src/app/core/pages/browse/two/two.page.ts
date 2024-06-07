import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { GenTwoPrime } from '@lib/models';
import { GenTwoPrimeService } from '@lib/services';
import { environment } from '@environment';

@Component({
  selector: 'app-core-browse-two',
  templateUrl: './two.page.html',
  styleUrls: ['./two.page.scss'],
})
export class CoreBrowseTwoPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: any = null;

  /**
   * Track prime details loading task
   */
  primeDetailsLoadTask: any = null;

  /**
   * True if data loading is going on
   */
  loading: boolean = true;

  /**
   * List of primes
   */
  primes: Array<GenTwoPrime> = [];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param genTwoPrimeService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private genTwoPrimeService: GenTwoPrimeService
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
    clearInterval(this.primeDetailsLoadTask);
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
   * Initialize tasks
   */
  initTasks() {
    this.loadPrimeDetails();
    this.primeDetailsLoadTask = setInterval(() => { this.loadPrimeDetails() }, 30000);
  }

  /**
   * Load prime details
   */
  loadPrimeDetails() {
    this.loading = true;
    this.chainHelper.lookupAccountCreatedApplications(environment.gen2.manager_address).then((applications: any) => {
      this.primes = this.genTwoPrimeService.list(applications);
      this.loading = false;
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
