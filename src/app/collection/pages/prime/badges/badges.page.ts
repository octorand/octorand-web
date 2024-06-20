import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BadgeHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';

@Component({
  selector: 'app-collection-prime-badges',
  templateUrl: './badges.page.html',
  styleUrls: ['./badges.page.scss'],
})
export class CollectionPrimeBadgesPage implements OnInit, OnChanges {

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
   * List of badges
   */
  badges: Array<any> = [];

  /**
   * Construct component
   *
   * @param appHelper
   * @param badgeHelper
   */
  constructor(
    private badgeHelper: BadgeHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initBadges();
    this.refreshView();
  }

  /**
   * Component parameters changed
   */
  ngOnChanges() {
    this.refreshView();
  }

  /**
   * Initialize badges
   */
  initBadges() {
    this.badges = this.badgeHelper.list();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {
      for (let i = 0; i < this.badges.length; i++) {
        this.badges[i].active = this.prime.badges.includes(this.badges[i].name);
      }
    }
  }
}
