import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppModel, DataModel, PrimeModel } from '@lib/models';

@Component({
  selector: 'app-collection-prime-family',
  templateUrl: './family.page.html',
  styleUrls: ['./family.page.scss'],
})
export class CollectionPrimeFamilyPage implements OnInit, OnChanges {

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

  /**
   * Construct component
   */
  constructor(
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.refreshView();
  }

  /**
   * Component parameters changed
   */
  ngOnChanges() {
    this.refreshView();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {

    }
  }
}
