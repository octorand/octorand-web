import { Component, Input } from '@angular/core';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-owner',
  templateUrl: './owner.tag.html',
  styleUrls: ['./owner.tag.scss'],
})
export class PrimeOwnerTag {

  /**
   * The prime parameters
   */
  @Input() prime: PrimeModel = new PrimeModel();
}
