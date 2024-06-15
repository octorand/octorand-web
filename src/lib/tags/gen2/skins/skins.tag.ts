import { Component, Input } from '@angular/core';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen2-skins',
  templateUrl: './skins.tag.html',
  styleUrls: ['./skins.tag.scss'],
})
export class GenTwoSkinsTag {

  /**
  * The prime parameters
  */
  @Input() prime: PrimeModel = new PrimeModel();
}
