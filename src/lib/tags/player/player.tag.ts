import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
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

  /**
   * Construct component
   *
   * @param router
   */
  constructor(
    private router: Router
  ) { }

  /**
   * Open purchase hearts page
   */
  purchaseHearts() {
    this.navigateToPage('/platform/games/purchase');
  }

  /**
   * Open redeem stars page
   */
  redeemStars() {
    this.navigateToPage('/platform/games/redeem');
  }

  /**
   * Open view rankings page
   */
  viewRankings() {
    this.navigateToPage('/platform/games/rankings');
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }
}
