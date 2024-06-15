import { Component, Input } from '@angular/core';
import { GenTwoPrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen2-owner',
  templateUrl: './owner.tag.html',
  styleUrls: ['./owner.tag.scss'],
})
export class GenTwoOwnerTag {

  /**
  * The prime parameters
  */
  @Input() prime: GenTwoPrimeModel = new GenTwoPrimeModel();
}
