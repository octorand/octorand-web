import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-gen1-boxes',
  templateUrl: './boxes.tag.html',
  styleUrls: ['./boxes.tag.scss'],
})
export class GenOneBoxesTag implements OnInit, OnChanges {

  /**
   * List of name boxes
   */
  boxes: Array<any> = [];

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

    this.boxes = [];
    for (let i = 0; i < 8; i++) {
      let color = this.colorHelper.findColor(params[i]);
      this.boxes.push({
        value: this.prime.name.charAt(i),
        color: color
      });
    }
  }
}
