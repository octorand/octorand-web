import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionModel } from '@lib/models';

@Component({
  selector: 'lib-tags-collection',
  templateUrl: './collection.tag.html',
  styleUrls: ['./collection.tag.scss'],
})
export class CollectionTag {

  /**
   * Selected collection
   */
  @Input() collection: CollectionModel = new CollectionModel();

  /**
   * Selected option
   */
  @Input() selectedOption: string = 'Browse';

  /**
   * Keys for options
   */
  options: Array<string> = [
    'Browse',
    'Market',
    'Account',
    'Statistics',
    'Tokenomics',
    'Traits',
  ];

  /**
   * Construct component
   *
   * @param router
   */
  constructor(
    private router: Router
  ) { }

  /**
   * Open details page
   *
   * @param id
   */
  openDetails(id: string) {
    this.navigateToPage('/tools/launchpad/' + this.collection.id + '/' + id.toLowerCase());
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
