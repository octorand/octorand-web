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
   * Prime parent
   */
  parent: PrimeModel = new PrimeModel();

  /**
   * List of prime children
   */
  children: Array<PrimeModel> = [];

  /**
   * List of prime siblings
   */
  siblings: Array<PrimeModel> = [];

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
      if (this.prime.gen == 1) {
        let childrenIds = this.prime.children.map(c => c.id);
        this.children = this.data.gen_two_primes.filter(p => childrenIds.includes(p.id));
      } else {
        this.parent = this.data.gen_one_primes.filter(p => p.id == this.prime.parent.id)[0];
        let siblingIds = this.parent.children.map(c => c.id);
        this.siblings = this.data.gen_two_primes.filter(p => siblingIds.includes(p.id));
      }
    }
  }
}
