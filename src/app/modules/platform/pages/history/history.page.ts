import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment';
import { IndexerHelper } from '@lib/helpers';

@Component({
  selector: 'app-platform-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class PlatformHistoryPage implements OnInit {

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
   * Track data loading
   */
  readyData = {
    genOneListings: false,
    genTwoListings: false,
    genOneSales: false,
    genTwoSales: false,
    genOneUpgrades: false,
    genTwoUpgrades: false,
  }

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param dataHelper
   */
  constructor(
    private router: Router,
    private indexerHelper: IndexerHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.refreshView();
  }

  /**
   * Refresh view state
   */
  refreshView() {
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
        let value = values[0];
        let listings = [];

        for (let i = 0; i < value.length; i++) {
          value[i].gen = 1;
          value[i].id_text = String(value[i].params.prime).padStart(3, '0');
          value[i].url = '/collection/prime/gen' + value[i].gen + '/' + value[i].id_text;
          listings.push(value[i]);
        }

        this.genOneListings = listings;
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
        let value = values[0];
        let listings = [];

        for (let i = 0; i < value.length; i++) {
          value[i].gen = 2;
          value[i].id_text = String(value[i].params.prime).padStart(4, '0');
          value[i].url = '/collection/prime/gen' + value[i].gen + '/' + value[i].id_text;
          listings.push(value[i]);
        }

        this.genTwoListings = listings;
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
        let value = values[0];
        let sales = [];

        for (let i = 0; i < value.length; i++) {
          value[i].gen = 1;
          value[i].id_text = String(value[i].params.prime).padStart(3, '0');
          value[i].url = '/collection/prime/gen' + value[i].gen + '/' + value[i].id_text;
          sales.push(value[i]);
        }

        this.genOneSales = sales;
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
        let value = values[0];
        let sales = [];

        for (let i = 0; i < value.length; i++) {
          value[i].gen = 2;
          value[i].id_text = String(value[i].params.prime).padStart(4, '0');
          value[i].url = '/collection/prime/gen' + value[i].gen + '/' + value[i].id_text;
          sales.push(value[i]);
        }

        this.genTwoSales = sales;
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
        let value = values[0];
        let upgrades = [];

        for (let i = 0; i < value.length; i++) {
          value[i].gen = 1;
          value[i].id_text = String(value[i].params.prime).padStart(3, '0');
          value[i].url = '/collection/prime/gen' + value[i].gen + '/' + value[i].id_text;
          upgrades.push(value[i]);
        }

        this.genOneUpgrades = upgrades;
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
        let value = values[0];
        let upgrades = [];

        for (let i = 0; i < value.length; i++) {
          value[i].gen = 2;
          value[i].id_text = String(value[i].params.prime).padStart(4, '0');
          value[i].url = '/collection/prime/gen' + value[i].gen + '/' + value[i].id_text;
          upgrades.push(value[i]);
        }

        this.genTwoUpgrades = upgrades;
        this.readyData.genTwoUpgrades = true;
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
