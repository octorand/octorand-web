import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel } from '@lib/models';
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
   * Prime generation
   */
  @Input() primeGen: string = '';

  /**
   * Prime id
   */
  @Input() primeId: string = '';

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

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
    this.initParams();
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
   * Initialize params
   */
  initParams() {
    this.primeGen = String(this.activatedRoute.snapshot.params['gen']).toUpperCase();
    this.primeId = this.activatedRoute.snapshot.params['id'];
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.data && this.data.initialised) {
      this.ready = true;
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
