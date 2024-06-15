import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BadgeHelper } from '@lib/helpers';
import { GenOnePrimeModel } from '@lib/models';

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
  @Input() prime: GenOnePrimeModel = new GenOnePrimeModel();

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
      let background = this.prime.badges.includes(badges[i].name) ? '#1890ff' : '#000000';
      let color = this.prime.badges.includes(badges[i].name) ? '#ffffff' : '#333333';

      this.badgesOne.push({
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        background: background,
        color: color,
      });
    }

    this.badgesTwo = [];
    for (let i = 10; i < 20; i++) {
      let background = this.prime.badges.includes(badges[i].name) ? '#1890ff' : '#000000';
      let color = this.prime.badges.includes(badges[i].name) ? '#ffffff' : '#333333';

      this.badgesTwo.push({
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        background: background,
        color: color,
      });
    }
  }
}
