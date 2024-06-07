import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrime } from '@lib/models';
import { GenOnePrimeService } from '@lib/services';
import { Subscription } from 'rxjs';
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
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Data subscription
   */
  dataSubscription: Subscription = new Subscription();

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
   * @param dataHelper
   * @param genOnePrimeService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private dataHelper: DataHelper,
    private chainHelper: ChainHelper,
    private genOnePrimeService: GenOnePrimeService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initData();
    this.initTasks();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
    clearInterval(this.primeDetailsLoadTask);
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
   * Initialize data
   */
  initData() {
    this.dataSubscription = this.dataHelper.data.subscribe((value: any) => {
      this.primes = value.gen1.primes;
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
      let primes = this.genOnePrimeService.list(applications);
      this.dataHelper.setGenOnePrimes(primes);
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
