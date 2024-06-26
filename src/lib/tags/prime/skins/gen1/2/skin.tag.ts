import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen1-2',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenOneTag2 implements OnInit, OnChanges {

  shades: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
  twirls: Array<any> = [];
  borders: Array<any> = [];

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
    this.calculateArcParams();
    this.calculateSliceParams();
    this.calculateTwirlParams();
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
      let radius = 230;

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
   * Generate the arc params for this prime
   */
  calculateArcParams() {
    this.arcs = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let angle = ((i + 1) * 360 / this.prime.name.length);
      let slope = angle * Math.PI / 180;

      let radius1 = 254;
      let x1 = Math.cos(slope) * radius1 + 256;
      let y1 = Math.sin(slope) * radius1 + 256;

      let radius2 = 208;
      let x2 = Math.cos(slope) * radius2 + 256;
      let y2 = Math.sin(slope) * radius2 + 256;

      this.arcs.push({
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
      });
    }
  }

  /**
   * Generate the slice params for this prime
   */
  calculateSliceParams() {
    this.slices = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let angle = (i + 1) * 360 / this.prime.name.length;
      let slope = angle * Math.PI / 180;
      let radius = 208;

      let x = Math.cos(slope) * radius + 256;
      let y = Math.sin(slope) * radius + 256;

      this.slices.push({
        x: x,
        y: y
      });
    }
  }

  /**
   * Generate the twirl params for this prime
   */
  calculateTwirlParams() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    this.twirls = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let radius = 50 + params[i] * 5;
      let color = this.colorHelper.findColor(params[i]);

      this.twirls.push({
        radius: radius,
        color: color
      });
    }

    this.twirls.sort((first, second) => second.radius - first.radius);

    this.borders = [
      { radius: Math.max(...this.twirls.slice(0, 16).map(t => t.radius)) }
    ];
  }
}
