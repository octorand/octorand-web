import { Component, Input, OnChanges, OnInit } from '@angular/core';
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
    if (this.item) {
      let badges = [];

      for (let i = 0; i < this.item.params.length; i++) {
        let param = this.item.params[i];

        for (let j = 0; j < param.values.length; j++) {
          let value = param.values[j];

          let count = this.collection.items.filter(x => x.params.find(y => y.name == param.name) && x.params.find(y => y.name == param.name)?.values.includes(value)).length;
          let percentage = Math.floor(count * 100 / this.collection.items.length);

          badges.push({
            param: param.name,
            value: value,
            count: count,
            percentage: percentage
          });
        }
      }

      this.badges = badges;
    }
  }
}
