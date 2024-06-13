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
   * Gen one primes total
   */
  genOneTotal: number = 0;

  /**
   * Gen two primes total
   */
  genTwoTotal: number = 0;

  /**
   * Gen one prime owners total
   */
  genOneOwners: number = 0;

  /**
   * Gen two prime owners total
   */
  genTwoOwners: number = 0;

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
      this.genOneTotal = this.data.genOnePrimes.length;
      this.genTwoTotal = this.data.genTwoPrimes.length;

      let genOneOwners: Array<string> = [];
      for (let i = 0; i < this.data.genOnePrimes.length; i++) {
        if (!genOneOwners.includes(this.data.genOnePrimes[i].owner)) {
          genOneOwners.push(this.data.genOnePrimes[i].owner);
        }
      }
      this.genOneOwners = genOneOwners.length;

      let genTwoOwners: Array<string> = [];
      for (let i = 0; i < this.data.genTwoPrimes.length; i++) {
        if (!genTwoOwners.includes(this.data.genTwoPrimes[i].owner)) {
          genTwoOwners.push(this.data.genTwoPrimes[i].owner);
        }
      }
      this.genTwoOwners = genTwoOwners.length;
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
