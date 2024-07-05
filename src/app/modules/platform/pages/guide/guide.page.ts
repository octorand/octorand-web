import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreHelper } from '@lib/helpers';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-guide',
  templateUrl: './guide.page.html',
  styleUrls: ['./guide.page.scss'],
})
export class PlatformGuidePage implements OnInit {

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Details of prime generations
   */
  generations: Array<any> = [];

  /**
   * Platform asset id
   */
  assetId: number = 0;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param dataHelper
   * @param storeHelper
   */
  constructor(
    private router: Router,
    private storeHelper: StoreHelper
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
    this.assetId = environment.platform.asset_id;

    let genOne = {
      id: 1,
      name: 'GEN1',
      count: 1000,
      name_letters: 8,
      mint_price: 100 * Math.pow(10, 6),
      rewards: 1000 * Math.pow(10, 6),
      rename_cost: 10 * Math.pow(10, 6),
      repaint_cost: 10 * Math.pow(10, 6),
    };

    let genTwo = {
      id: 2,
      name: 'GEN2',
      count: 8000,
      name_letters: 16,
      mint_price: 25 * Math.pow(10, 6),
      rewards: 8 * Math.pow(10, 6),
      rename_cost: 1 * Math.pow(10, 6),
      repaint_cost: 1 * Math.pow(10, 6),
    };

    this.generations = [
      genOne,
      genTwo,
    ];

    this.ready = true;
  }

  /**
   * Open browse primes page
   *
   * @param gen
   */
  openGen(gen: number) {
    this.storeHelper.setBrowseGen(gen);
    this.storeHelper.setBrowseBadges([]);
    this.storeHelper.setBrowseSort('Rank');
    this.navigateToPage('/collection/browse');
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
