import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel } from '@lib/models';
import { GenOnePrimeService, GenTwoPrimeService } from '@lib/services';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-core-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class CoreBrowsePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * Data state
   */
  data: DataModel = new DataModel();

  /**
   * View model
   */
  view = {
    gen1: {
      total: 0
    },
    gen2: {
      total: 0
    }
  }

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
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   * @param genOnePrimeService
   * @param genTwoPrimeService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper,
    private genOnePrimeService: GenOnePrimeService,
    private genTwoPrimeService: GenTwoPrimeService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initData();
    this.initTasks();
    this.refreshView();
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
    this.appSubscription = this.appHelper.app.subscribe((value: AppModel) => {
      this.app = value;
    });
  }

  /**
   * Initialize data
   */
  initData() {
    this.data = this.dataHelper.getDefaultState();
    this.dataSubscription = this.dataHelper.data.subscribe((value: DataModel) => {
      this.data = value;
      this.refreshView();
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
    this.chainHelper.lookupAccountCreatedApplications(environment.gen1.manager_address).then((applications: any) => {
      let primes = this.genOnePrimeService.list(applications);
      this.dataHelper.setGenOnePrimes(primes);
    });

    this.chainHelper.lookupAccountCreatedApplications(environment.gen2.manager_address).then((applications: any) => {
      let primes = this.genTwoPrimeService.list(applications);
      this.dataHelper.setGenTwoPrimes(primes);
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.data) {
      this.view.gen1.total = this.data.genOnePrimes.length;
      this.view.gen2.total = this.data.genTwoPrimes.length;
    }
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
