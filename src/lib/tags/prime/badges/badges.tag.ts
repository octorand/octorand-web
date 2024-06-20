import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BadgeHelper } from '@lib/helpers';
import { DataModel, PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-badges',
  templateUrl: './badges.tag.html',
  styleUrls: ['./badges.tag.scss'],
})
export class PrimeBadgesTag implements OnInit, OnChanges {

  /**
   * First row of badges
   */
  badgesOne: Array<any> = [];

  /**
   * Second row of badges
   */
  badgesTwo: Array<any> = [];

  /**
   * Data state
   */
  @Input() data: DataModel = new DataModel();

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

    let primes = [];
    if (this.prime.gen == 1) {
      primes = this.data.gen_one_primes;
    } else {
      primes = this.data.gen_two_primes;
    }

    this.badgesOne = [];
    for (let i = 0; i < 10; i++) {
      let alignment = 'center';
      if (i % 10 < 3) {
        alignment = 'left';
      } else if (i % 10 > 6) {
        alignment = 'right';
      }

      let count = primes.filter(p => p.badges.includes(badges[i].name)).length;
      let percentage = Math.floor(count * 100 / primes.length);

      this.badgesOne.push({
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        description: badges[i].description,
        active: this.prime.badges.includes(badges[i].name),
        alignment: alignment,
        count: count,
        percentage: percentage
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

      let count = primes.filter(p => p.badges.includes(badges[i].name)).length;
      let percentage = Math.floor(count * 100 / primes.length);

      this.badgesTwo.push({
        key: i,
        id: badges[i].id,
        name: badges[i].name,
        icon: badges[i].icon,
        description: badges[i].description,
        active: this.prime.badges.includes(badges[i].name),
        alignment: alignment,
        count: count,
        percentage: percentage
      });
    }
  }
}
