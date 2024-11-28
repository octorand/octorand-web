import { Component, Input } from '@angular/core';
import { PlayerModel } from '@lib/models';

@Component({
  selector: 'lib-tags-player',
  templateUrl: './player.tag.html',
  styleUrls: ['./player.tag.scss'],
})
export class PlayerTag {

  /**
   * Selected player
   */
  @Input() player: PlayerModel = new PlayerModel();
}
