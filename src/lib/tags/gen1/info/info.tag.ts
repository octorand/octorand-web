import { Component, Input } from '@angular/core';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen1-info',
  templateUrl: './info.tag.html',
  styleUrls: ['./info.tag.scss'],
})
export class GenOneInfoTag {

  /**
  * The prime parameters
  */
  @Input() prime: PrimeModel = new PrimeModel();
}
