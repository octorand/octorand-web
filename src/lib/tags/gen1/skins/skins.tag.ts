import { Component, Input } from '@angular/core';
import { GenOnePrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen1-skins',
  templateUrl: './skins.tag.html',
  styleUrls: ['./skins.tag.scss'],
})
export class GenOneSkinsTag {

  /**
  * The prime parameters
  */
  @Input() prime: GenOnePrimeModel = new GenOnePrimeModel();
}
