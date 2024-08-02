import { Component, Input } from '@angular/core';
import { ItemModel } from '@lib/models';

@Component({
  selector: 'lib-tags-item-image',
  templateUrl: './image.tag.html',
  styleUrls: ['./image.tag.scss'],
})
export class ItemImageTag {

  /**
   * The item parameters
   */
  @Input() item: ItemModel = new ItemModel();
}
