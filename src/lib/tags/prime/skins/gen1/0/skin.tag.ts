import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen1-0',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenOneTag0 implements OnInit, OnChanges {

  shades: Array<any> = [];
  blocks: Array<any> = [];
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
    this.calculateImageParams();
    this.calculateBlockParams();
    this.calculateArmParams();
  }

  /**
   * Generate the image params for this prime
   */
  calculateImageParams() {
    this.shades = this.colorHelper.findShades(this.prime.theme);
  }

  /**
   * Generate the image block params for this prime
   */
  calculateBlockParams() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    this.blocks = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let radius = 211;

      let sangle = (i + 1) * 360 / this.prime.name.length;
      let sslope = sangle * Math.PI / 180;
      let sx = Math.cos(sslope) * radius + 256;
      let sy = Math.sin(sslope) * radius + 256;

      let eangle = (i + 2) * 360 / this.prime.name.length;
      let eslope = eangle * Math.PI / 180;
      let ex = Math.cos(eslope) * radius + 256;
      let ey = Math.sin(eslope) * radius + 256;

      let move = 'M ' + sx + ' ' + sy;
      let arc = 'A ' + radius + ' ' + radius + ' 0 0 1 ' + ex + ' ' + ey;
      let curve = move + ' ' + arc;

      let color = this.colorHelper.findColor(params[i]);

      this.blocks.push({
        curve: curve,
        color: color
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
    for (let i = 0; i < this.prime.name.length; i++) {
      let angle = (i + 1) * 360 / this.prime.name.length;
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
}
