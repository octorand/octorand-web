import { Component, Input } from '@angular/core';
import { ItemModel } from '@lib/models';

@Component({
  selector: 'lib-tags-item-owner',
  templateUrl: './owner.tag.html',
  styleUrls: ['./owner.tag.scss'],
})
export class ItemOwnerTag {

  /**
   * The item parameters
   */
  @Input() item: ItemModel = new ItemModel();
}
