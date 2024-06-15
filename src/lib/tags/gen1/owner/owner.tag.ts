import { Component, Input } from '@angular/core';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen1-owner',
  templateUrl: './owner.tag.html',
  styleUrls: ['./owner.tag.scss'],
})
export class GenOneOwnerTag {

  /**
  * The prime parameters
  */
  @Input() prime: PrimeModel = new PrimeModel();
}
