import { Component, Input } from '@angular/core';
import { AppModel, DataModel, PrimeModel } from '@lib/models';

@Component({
  selector: 'app-collection-prime-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class CollectionPrimeSummaryPage {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
   * Data state
   */
  @Input() data: DataModel = new DataModel();

  /**
   * Prime details
   */
  @Input() prime: PrimeModel = new PrimeModel();
}
