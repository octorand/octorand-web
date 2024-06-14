import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { GenTwoPrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen2-boxes',
  templateUrl: './boxes.tag.html',
  styleUrls: ['./boxes.tag.scss'],
})
export class GenTwoBoxesTag implements OnInit, OnChanges {

  /**
   * First row of name boxes
   */
  boxesOne: Array<any> = [];

  /**
   * Second row of name boxes
   */
  boxesTwo: Array<any> = [];

  /**
  * The prime parameters
  */
  @Input() prime: GenTwoPrimeModel = new GenTwoPrimeModel();

  constructor(
    private colorHelper: ColorHelper
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
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    this.boxesOne = [];
    for (let i = 0; i < 8; i++) {
      let color = this.colorHelper.findColor(params[i]);
      this.boxesOne.push({
        value: this.prime.name.charAt(i),
        color: color
      });
    }

    this.boxesTwo = [];
    for (let i = 8; i < 16; i++) {
      let color = this.colorHelper.findColor(params[i]);
      this.boxesTwo.push({
        value: this.prime.name.charAt(i),
        color: color
      });
    }
  }
}
