import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppModel, PrimeModel } from '@lib/models';

@Component({
  selector: 'app-collection-prime-listing',
  templateUrl: './listing.page.html',
  styleUrls: ['./listing.page.scss'],
})
export class CollectionPrimeListingPage implements OnInit {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
  * The prime parameters
  */
  @Input() prime: PrimeModel = new PrimeModel();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Construct component
   *
   * @param router
   */
  constructor(
    private router: Router
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
    if (this.prime) {
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
