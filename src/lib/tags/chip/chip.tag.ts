import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-tags-chip',
  templateUrl: './chip.tag.html',
  styleUrls: ['./chip.tag.scss'],
})
export class ChipTag {

  /**
   * Name of chip
   */
  @Input() key: string = '';

  /**
   * Status of chip
   */
  @Input() active: boolean = false;
}
