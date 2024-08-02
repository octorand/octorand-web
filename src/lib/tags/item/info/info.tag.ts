import { Component, Input } from '@angular/core';
import { ItemModel } from '@lib/models';

@Component({
  selector: 'lib-tags-item-info',
  templateUrl: './info.tag.html',
  styleUrls: ['./info.tag.scss'],
})
export class ItemInfoTag {

  /**
   * The item parameters
   */
  @Input() item: ItemModel = new ItemModel();
}
