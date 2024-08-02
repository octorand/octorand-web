import { Component, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { ItemModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'lib-tags-item-image',
  templateUrl: './image.tag.html',
  styleUrls: ['./image.tag.scss'],
})
export class ItemImageTag implements OnInit, OnChanges {

  /**
   * The item parameters
   */
  @Input() item: ItemModel = new ItemModel();

  /**
   * Image url
   */
  url: string = '';

  /**
   * Image background
   */
  background: string = '';

  /**
   * Initialize component
   */
  ngOnInit() {
    this.calculate();
  }

  /**
   * Component parameters changed
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    let prime: SimpleChange = changes['prime'];
    if (prime && !prime.firstChange) {
      this.calculate();
    }
  }

  /**
   * Calculate rendering parameters
   */
  calculate() {
    this.url = environment.image_server + '/' + this.item.image + '?optimizer=image&width=200';
    this.background = 'hsl(' + this.item.score % 360 + ', 100%, 75%)';
  }
}
