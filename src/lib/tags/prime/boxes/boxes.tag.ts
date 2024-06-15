import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-boxes',
  templateUrl: './boxes.tag.html',
  styleUrls: ['./boxes.tag.scss'],
})
export class PrimeBoxesTag implements OnInit, OnChanges {

  /**
   * List of first row name boxes
   */
  boxesOne: Array<any> = [];

  /**
   * List of second row name boxes
   */
  boxesTwo: Array<any> = [];

  /**
  * The prime parameters
  */
  @Input() prime: PrimeModel = new PrimeModel();

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
    if (this.prime.gen == 2) {
      for (let i = 8; i < 16; i++) {
        let color = this.colorHelper.findColor(params[i]);
        this.boxesTwo.push({
          value: this.prime.name.charAt(i),
          color: color
        });
      }
    }
  }
}
