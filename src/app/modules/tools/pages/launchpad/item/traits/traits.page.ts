import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BadgeHelper } from '@lib/helpers';
import { AppModel, CollectionModel, ItemModel, LaunchpadModel } from '@lib/models';

@Component({
  selector: 'app-tools-launchpad-item-traits',
  templateUrl: './traits.page.html',
  styleUrls: ['./traits.page.scss'],
})
export class ToolsLaunchpadItemTraitsPage implements OnInit, OnChanges {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
   * Launchpad state
   */
  @Input() launchpad: LaunchpadModel = new LaunchpadModel();

  /**
   * Collection details
   */
  @Input() collection: CollectionModel = new CollectionModel();

  /**
   * Item details
   */
  @Input() item: ItemModel = new ItemModel();

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

      let primes = [];
      if (this.prime.gen == 1) {
        primes = this.data.gen_one_primes;
      } else {
        primes = this.data.gen_two_primes;
      }

      for (let i = 0; i < this.badges.length; i++) {
        this.badges[i].count = primes.filter(p => p.badges.includes(this.badges[i].name)).length;
        this.badges[i].percentage = Math.floor(this.badges[i].count * 100 / primes.length);
      }
    }
  }
}
