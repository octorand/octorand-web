import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { GenOnePrime } from '@lib/models';
import { GenOnePrimeService } from '@lib/services';
import { environment } from '@environment';

@Component({
  selector: 'app-core-browse-one',
  templateUrl: './one.page.html',
  styleUrls: ['./one.page.scss'],
})
export class CoreBrowseOnePage implements OnInit, OnDestroy {

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
  primes: Array<GenOnePrime> = [];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param genOnePrimeService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private genOnePrimeService: GenOnePrimeService
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
    this.chainHelper.lookupAccountCreatedApplications(environment.gen1.manager_address).then((applications: any) => {
      this.primes = this.genOnePrimeService.list(applications);
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
