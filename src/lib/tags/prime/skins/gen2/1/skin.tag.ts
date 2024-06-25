import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-1',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenTwoTag1 implements OnInit, OnChanges {

  shades: Array<any> = [];
  lines: Array<any> = [];
  pies: Array<any> = [];

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
    this.calculateLineParams();
    this.calculatePieParams();
    this.calculateImageParams();
  }

  /**
   * Generate the image circle params for this prime
   */
  calculateLineParams() {
    this.lines = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let angle = (i + 1) * 360 / this.prime.name.length;
      let slope = angle * Math.PI / 180;
      let radius = 256;

      let nx = Math.cos(slope) * radius + 256;
      let ny = Math.sin(slope) * radius + 256;

      this.lines.push({
        x: nx,
        y: ny
      });
    }
  }

  /**
   * Generate the pie params for this prime
   */
  calculatePieParams() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    this.pies = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let radius = 60 + params[i] * 5;

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
      let line = 'L 256 256';
      let curve = move + ' ' + arc;
      let path = curve + ' ' + line;

      let color = this.colorHelper.findColor(params[i]);

      this.pies.push({
        curve: curve,
        path: path,
        color: color
      });
    }
  }

  /**
   * Generate the image params for this prime
   */
  calculateImageParams() {
    this.shades = this.colorHelper.findShades(this.prime.theme);
  }
}
