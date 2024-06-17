import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection-prime',
  templateUrl: './prime.page.html',
  styleUrls: ['./prime.page.scss'],
})
export class CollectionPrimePage implements OnInit, OnDestroy {

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
   * Prime details
   */
  prime: PrimeModel = new PrimeModel();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Selected feature
   */
  selectedFeature: string = 'Overview';

  /**
   * Keys for features
   */
  features: Array<string> = [
    'Overview',
    'Listing',
  ];

  /**
   * Construct component
   *
   * @param activatedRoute
   * @param router
   * @param appHelper
   * @param dataHelper
   */
  constructor(
    private activatedRoute: ActivatedRoute,
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
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
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
   * Refresh view state
   */
  refreshView() {
    if (this.data && this.data.initialised) {
      let gen = Number(this.activatedRoute.snapshot.params['gen'].replace(/\D/g, ''));
      let id = Number(this.activatedRoute.snapshot.params['id']);

      if (gen == 1) {
        let prime = this.data.gen_one_primes.find(p => p.id == id);
        if (prime) {
          this.prime = prime;
        }
      } else {
        let prime = this.data.gen_two_primes.find(p => p.id == id);
        if (prime) {
          this.prime = prime;
        }
      }

      if (this.prime) {
        this.ready = true;
      }
    }
  }

  /**
   * When feature is changed
   *
   * @param feature
   */
  changeFeature(feature: string) {
    this.selectedFeature = feature;
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
