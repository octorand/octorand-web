import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-arms',
  templateUrl: './arms.tag.html',
  styleUrls: ['./arms.tag.scss'],
})
export class PrimeSkinsGenTwoArmsTag implements OnInit, OnChanges {

  traitColor: string = '';
  shades: Array<any> = [];
  circles: Array<any> = [];
  lines: Array<any> = [];
  arms: Array<any> = [];

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
    this.calculateCircleParams();
    this.calculateLineParams();
    this.calculateArmParams();
    this.calculateImageParams();
  }

  /**
   * Generate the image circle params for this prime
   */
  calculateCircleParams() {
    this.circles = [];
    for (let i = 0; i < 26; i++) {
      let radius = 60 + (i * 5);

      this.circles.push({
        radius: radius
      });
    }
  }

  /**
   * Generate the image circle params for this prime
   */
  calculateLineParams() {
    this.lines = [];
    for (let i = 0; i < 8; i++) {
      let angle = (i + 1) * 360 / 8;
      let slope = angle * Math.PI / 180;
      let radius = 60 + (25 * 5);

      let nx = Math.cos(slope) * radius + 256;
      let ny = Math.sin(slope) * radius + 256;

      this.lines.push({
        x: nx,
        y: ny
      });
    }
  }

  /**
   * Generate the arm params for this prime
   */
  calculateArmParams() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    this.arms = [];
    for (let i = 0; i < 8; i++) {
      let angle = (i + 1) * 360 / params.length;
      let slope = angle * Math.PI / 180;
      let radius = 60 + params[i] * 5;

      let nx = Math.cos(slope) * radius + 256;
      let ny = Math.sin(slope) * radius + 256;
      let color = this.colorHelper.findColor(params[i]);

      this.arms.push({
        x: nx,
        y: ny,
        color: color
      });
    }
  }

  /**
   * Generate the image params for this prime
   */
  calculateImageParams() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let value = 0;
    for (let j = 0; j < this.prime.name.length; j++) {
      value = value + alphabet.indexOf(this.prime.name.charAt(j));
    }
    value = Math.floor(value / 8);

    this.shades = this.colorHelper.findShades(this.prime.theme);
    this.traitColor = this.colorHelper.findColor(value);
  }
}
