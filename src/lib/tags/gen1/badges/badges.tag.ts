import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BadgeHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen1-badges',
  templateUrl: './badges.tag.html',
  styleUrls: ['./badges.tag.scss'],
})
export class GenOneBadgesTag implements OnInit, OnChanges {

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
  @Input() prime: PrimeModel = new PrimeModel();

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
      let alignment = 'center';
      if (i % 10 < 3) {
        alignment = 'left';
      } else if (i % 10 > 6) {
        alignment = 'right';
      }

      this.badgesOne.push({
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        active: this.prime.badges.includes(badges[i].name),
        alignment: alignment
      });
    }

    this.badgesTwo = [];
    for (let i = 10; i < 20; i++) {
      let alignment = 'center';
      if (i % 10 < 3) {
        alignment = 'left';
      } else if (i % 10 > 6) {
        alignment = 'right';
      }

      this.badgesTwo.push({
        key: i,
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        active: this.prime.badges.includes(badges[i].name),
        alignment: alignment
      });
    }
  }
}
