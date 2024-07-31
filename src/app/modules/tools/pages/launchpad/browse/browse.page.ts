import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, LaunchpadHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-tools-launchpad-browse',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.scss'],
})
export class ToolsLaunchpadBrowsePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * Launchpad state
   */
  launchpad: LaunchpadModel = new LaunchpadModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Launchpad subscription
   */
  launchpadSubscription: Subscription = new Subscription();

  /**
   * Collection details
   */
  collection: CollectionModel = new CollectionModel();

  /**
   * Current page number
   */
  currentPage: number = 1;

  /**
   * Number of results per page
   */
  resultsPerPage: number = environment.display_page_size;

  /**
   * Total number of results
   */
  totalResults: number = 0;

  /**
   * Total number of pages
   */
  pagesCount: number = 0;

  /**
   * Results of current page
   */
  currentPageResults: Array<ItemModel> = [];

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Selected sort
   */
  selectedSort: string = 'Rank';

  /**
   * Keys for sorting
   */
  sorts: Array<string> = [
    'Id',
    'Rank',
    'Rewards',
    'Price',
  ];


  /**
   * Construct component
   *
   * @param activatedRoute
   * @param router
   * @param appHelper
   * @param launchpadHelper
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appHelper: AppHelper,
    private launchpadHelper: LaunchpadHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initLaunchpad();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
    this.launchpadSubscription.unsubscribe();
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
   * Initialize launchpad
   */
  initLaunchpad() {
    this.launchpad = this.launchpadHelper.getDefaultState();
    this.launchpadSubscription = this.launchpadHelper.launchpad.subscribe((value: LaunchpadModel) => {
      this.launchpad = value;
      this.refreshView();
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.launchpad && this.launchpad.initialised) {
      let id = this.activatedRoute.snapshot.params['id'];
      let collection = this.launchpad.collections.find(x => x.id == id);

      if (collection) {
        this.collection = collection;

        let allResults = this.collection.items;

        switch (this.selectedSort) {
          case 'Id':
            allResults.sort((first, second) => first.id - second.id);
            break;
          case 'Rank':
            allResults.sort((first, second) => first.rank - second.rank);
            break;
          case 'Rewards':
            allResults.sort((first, second) => second.rewards - first.rewards);
            break;
          case 'Price':
            allResults.sort((first, second) => {
              function value(price: number) {
                return price == 0 ? Infinity : price;
              }
              return value(first.price) - value(second.price);
            });
            break;
        }

        let totalResults = allResults.length;
        let pagesCount = Math.ceil(totalResults / this.resultsPerPage);

        let start = this.resultsPerPage * (this.currentPage - 1);
        let end = start + this.resultsPerPage;
        let currentPageResults = allResults.slice(start, end);

        this.totalResults = totalResults;
        this.pagesCount = pagesCount;
        this.currentPageResults = currentPageResults;

        if (this.currentPage > this.pagesCount) {
          this.currentPage = 1;
        }

        this.ready = true;
      } else {
        this.navigateToPage('/tools/launchpad');
      }
    }
  }

  /**
   * When page is changed
   *
   * @param page
   */
  changePage(page: any) {
    this.currentPage = page;
    this.refreshView();
  }

  /**
   * Open filters view
   */
  openFilters() {

  }

  /**
   * Close filters view
   */
  closeFilters() {

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
