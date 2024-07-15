import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, DataHelper, IndexerHelper } from '@lib/helpers';
import { AppModel, DataModel } from '@lib/models';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class PlatformHistoryPage implements OnInit, OnDestroy {

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
  currentPageResults: Array<any> = [];

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Platform asset id
   */
  assetId: number = 0;

  /**
   * Selected generation
   */
  selectedGen: number = 1;

  /**
   * Selected action
   */
  selectedAction: string = 'Listings';

  /**
   * Keys for actions
   */
  actions: Array<string> = [
    'Listings',
    'Sales',
    'Upgrades',
    'Transforms',
    'Rewards',
  ];

  /**
   * List of gen one listings
   */
  genOneListings: Array<any> = [];

  /**
   * List of gen two listings
   */
  genTwoListings: Array<any> = [];

  /**
   * List of gen one sales
   */
  genOneSales: Array<any> = [];

  /**
   * List of gen two sales
   */
  genTwoSales: Array<any> = [];

  /**
   * List of gen one upgrades
   */
  genOneUpgrades: Array<any> = [];

  /**
   * List of gen two upgrades
   */
  genTwoUpgrades: Array<any> = [];

  /**
   * List of gen one transforms
   */
  genOneTransforms: Array<any> = [];

  /**
   * List of gen two transforms
   */
  genTwoTransforms: Array<any> = [];

  /**
   * List of gen one rewards
   */
  genOneRewards: Array<any> = [];

  /**
   * List of gen two rewards
   */
  genTwoRewards: Array<any> = [];

  /**
   * Track data loading
   */
  readyData = {
    genOneListings: false,
    genTwoListings: false,
    genOneSales: false,
    genTwoSales: false,
    genOneUpgrades: false,
    genTwoUpgrades: false,
    genOneTransforms: false,
    genTwoTransforms: false,
    genOneRewards: false,
    genTwoRewards: false,
  };

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param dataHelper
   * @param indexerHelper
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private dataHelper: DataHelper,
    private indexerHelper: IndexerHelper
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
    this.assetId = environment.platform.asset_id;

    if (this.data && this.data.initialised) {
      this.ready = false;
      switch (this.selectedAction) {
        case 'Listings':
          if (this.selectedGen == 1) {
            this.loadGenOneListings();
          } else {
            this.loadGenTwoListings();
          }
          break;
        case 'Sales':
          if (this.selectedGen == 1) {
            this.loadGenOneSales();
          } else {
            this.loadGenTwoSales();
          }
          break;
        case 'Upgrades':
          if (this.selectedGen == 1) {
            this.loadGenOneUpgrades();
          } else {
            this.loadGenTwoUpgrades();
          }
          break;
        case 'Transforms':
          if (this.selectedGen == 1) {
            this.loadGenOneTransforms();
          } else {
            this.loadGenTwoTransforms();
          }
          break;
        case 'Rewards':
          if (this.selectedGen == 1) {
            this.loadGenOneRewards();
          } else {
            this.loadGenTwoRewards();
          }
          break;
      }
    }
  }

  /**
   * Refresh results
   */
  refreshResults() {
    let allResults = [];

    switch (this.selectedAction) {
      case 'Listings':
        if (this.selectedGen == 1) {
          allResults = this.genOneListings;
        } else {
          allResults = this.genTwoListings;
        }
        break;
      case 'Sales':
        if (this.selectedGen == 1) {
          allResults = this.genOneSales;
        } else {
          allResults = this.genTwoSales;
        }
        break;
      case 'Upgrades':
        if (this.selectedGen == 1) {
          allResults = this.genOneUpgrades;
        } else {
          allResults = this.genTwoUpgrades;
        }
        break;
      case 'Transforms':
        if (this.selectedGen == 1) {
          allResults = this.genOneTransforms;
        } else {
          allResults = this.genTwoTransforms;
        }
        break;
      case 'Rewards':
        if (this.selectedGen == 1) {
          allResults = this.genOneRewards;
        } else {
          allResults = this.genTwoRewards;
        }
        break;
    }

    allResults.sort((first, second) => second.timestamp - first.timestamp);

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
  }

  /**
   * Load gen one listings
   */
  loadGenOneListings() {
    if (this.readyData.genOneListings) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.list.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genOneListings = data;
        this.readyData.genOneListings = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen two listings
   */
  loadGenTwoListings() {
    if (this.readyData.genTwoListings) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.list.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genTwoListings = data;
        this.readyData.genTwoListings = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen one sales
   */
  loadGenOneSales() {
    if (this.readyData.genOneSales) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.buy.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genOneSales = data;
        this.readyData.genOneSales = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen two sales
   */
  loadGenTwoSales() {
    if (this.readyData.genTwoSales) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.buy.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genTwoSales = data;
        this.readyData.genTwoSales = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen one upgrades
   */
  loadGenOneUpgrades() {
    if (this.readyData.genOneUpgrades) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.upgrade.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genOneUpgrades = data;
        this.readyData.genOneUpgrades = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen two upgrades
   */
  loadGenTwoUpgrades() {
    if (this.readyData.genTwoUpgrades) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.upgrade.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genTwoUpgrades = data;
        this.readyData.genTwoUpgrades = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen one transforms
   */
  loadGenOneTransforms() {
    if (this.readyData.genOneTransforms) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.rename.application_id),
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.repaint.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Rename';
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        value = values[1];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Repaint';
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genOneTransforms = data;
        this.readyData.genOneTransforms = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen two transforms
   */
  loadGenTwoTransforms() {
    if (this.readyData.genTwoTransforms) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.rename.application_id),
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.repaint.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Rename';
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        value = values[1];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Repaint';
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genTwoTransforms = data;
        this.readyData.genTwoTransforms = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen one rewards
   */
  loadGenOneRewards() {
    if (this.readyData.genOneRewards) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.mint.application_id),
        this.indexerHelper.lookupApplicationLogs(environment.gen1.contracts.prime.withdraw.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Reward';
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        value = values[1];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Royalty';
          value[i].prime = this.data.gen_one_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genOneRewards = data;
        this.readyData.genOneRewards = true;
        this.refreshResults();
      });
    }
  }

  /**
   * Load gen two rewards
   */
  loadGenTwoRewards() {
    if (this.readyData.genTwoRewards) {
      this.refreshResults();
    } else {
      let promises = [
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.mint.application_id),
        this.indexerHelper.lookupApplicationLogs(environment.gen2.contracts.prime.withdraw.application_id),
      ];

      Promise.all(promises).then(values => {
        let data = [];

        let value = values[0];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Reward';
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        value = values[1];
        for (let i = 0; i < value.length; i++) {
          value[i].action = 'Royalty';
          value[i].prime = this.data.gen_two_primes.find(p => p.id == value[i].params.prime);
          data.push(value[i]);
        }

        this.genTwoRewards = data;
        this.readyData.genTwoRewards = true;
        this.refreshResults();
      });
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
   * When gen is changed
   *
   * @param gen
   */
  changeGen(gen: number) {
    this.selectedGen = gen;
    this.currentPage = 1;
    this.refreshView();
  }

  /**
   * When action is changed
   *
   * @param action
   */
  changeAction(action: string) {
    this.selectedAction = action;
    this.currentPage = 1;
    this.refreshView();
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
