import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BadgeHelper } from '@lib/helpers';
import { GenTwoPrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen2-badges',
  templateUrl: './badges.tag.html',
  styleUrls: ['./badges.tag.scss'],
})
export class GenTwoBadgesTag implements OnInit, OnChanges {

  /**
   * First row of badges
   */
  badgesOne: Array<any> = [];

  /**
   * Second row of badges
   */
  badgesTwo: Array<any> = [];

  /**
  * The prime parameters
  */
  @Input() prime: GenTwoPrimeModel = new GenTwoPrimeModel();

  constructor(
    private badgeHelper: BadgeHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.calculate();
  }

  /**
   * Component parameters changed
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    let prime: SimpleChange = changes['prime'];
    if (prime && !prime.firstChange) {
      this.calculate();
    }
  }

  /**
   * Calculate rendering parameters
   */
  calculate() {
    this.calculateBoxParams();
  }

  /**
   * Generate the box params for this prime
   */
  calculateBoxParams() {
    let badges = this.badgeHelper.list();

    this.badgesOne = [];
    for (let i = 0; i < 10; i++) {
      this.badgesOne.push({
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        active: this.prime.badges.includes(badges[i].name)
      });
    }

    this.badgesTwo = [];
    for (let i = 10; i < 20; i++) {
      this.badgesTwo.push({
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        active: this.prime.badges.includes(badges[i].name)
      });
    }
  }
}
