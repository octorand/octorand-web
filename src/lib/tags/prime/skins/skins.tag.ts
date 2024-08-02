import { Component, Input } from '@angular/core';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins',
  templateUrl: './skins.tag.html',
  styleUrls: ['./skins.tag.scss'],
})
export class PrimeSkinsTag {

  /**
   * The prime parameters
   */
  @Input() prime: PrimeModel = new PrimeModel();
}
