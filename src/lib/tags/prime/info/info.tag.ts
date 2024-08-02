import { Component, Input } from '@angular/core';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-info',
  templateUrl: './info.tag.html',
  styleUrls: ['./info.tag.scss'],
})
export class PrimeInfoTag {

  /**
   * The prime parameters
   */
  @Input() prime: PrimeModel = new PrimeModel();
}
