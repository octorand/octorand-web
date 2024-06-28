import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class AppHomePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * Data state
   */
  data: DataModel = new DataModel();

  /**
   * Gen one prime state
   */
  primeOne: PrimeModel = new PrimeModel();

  /**
   * Gen two prime state
   */
  primeTwo: PrimeModel = new PrimeModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Data subscription
   */
  dataSubscription: Subscription = new Subscription();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Track prime details loading task
   */
  private primeDetailsLoadTask: any = null;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param dataHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private dataHelper: DataHelper
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
    });
  }

  /**
   * Initialize tasks
   */
  initTasks() {
    this.loadPrimeDetails();
    this.primeDetailsLoadTask = setInterval(() => { this.loadPrimeDetails() }, 2000);
  }

  /**
   * Load prime details
   */
  loadPrimeDetails() {
    if (this.data && this.data.initialised) {
      let sizeOne = this.data.gen_one_primes.length;
      let sizeTwo = this.data.gen_two_primes.length;

      this.primeOne = this.data.gen_one_primes[Math.floor(Math.random() * sizeOne)];
      this.primeTwo = this.data.gen_two_primes[Math.floor(Math.random() * sizeTwo)];
    } else {
      let primeOne = new PrimeModel();
      primeOne.gen = 1;
      primeOne.name = 'OCTORAND';
      this.primeOne = primeOne;

      let primeTwo = new PrimeModel();
      primeTwo.gen = 1;
      primeTwo.name = 'OCTORANDOCTORAND';
      this.primeTwo = primeTwo;
    }

    this.ready = true;
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
