import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-2',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenTwoTag2 implements OnInit, OnChanges {

  shades: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
  crosses: Array<any> = [];
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
    this.calculateCrossParams();
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

    let full = 115.5;
    let half = 57.75;
    let gap = 25;

    let paths = [
      `M ${half + gap} ${gap} L ${half + gap + full * 1} ${gap}`,
      `M ${half + gap + full * 1} ${gap} L ${half + gap + full * 2} ${gap}`,
      `M ${half + gap + full * 2} ${gap} L ${half + gap + full * 3} ${gap}`,
      `M ${half + gap + full * 3} ${gap} L ${gap + full * 4} ${gap} L ${gap + full * 4} ${half + gap}`,
      `M ${gap + full * 4} ${half + gap} L ${gap + full * 4} ${half + gap + full * 1}`,
      `M ${gap + full * 4} ${half + gap + full * 1} L ${gap + full * 4} ${half + gap + full * 2}`,
      `M ${gap + full * 4} ${half + gap + full * 2} L ${gap + full * 4} ${half + gap + full * 3}`,
      `M ${gap + full * 4} ${half + gap + full * 3} L ${gap + full * 4} ${gap + full * 4} L ${half + gap + full * 3} ${gap + full * 4}`,
      `M ${half + gap + full * 3} ${gap + full * 4} L ${half + gap + full * 2} ${gap + full * 4}`,
      `M ${half + gap + full * 2} ${gap + full * 4} L ${half + gap + full * 1} ${gap + full * 4}`,
      `M ${half + gap + full * 1} ${gap + full * 4} L ${half + gap} ${gap + full * 4}`,
      `M ${half + gap} ${gap + full * 4} L ${gap} ${gap + full * 4} L ${gap} ${half + gap + full * 3}`,
      `M ${gap} ${half + gap + full * 3} L ${gap} ${half + gap + full * 2}`,
      `M ${gap} ${half + gap + full * 2} L ${gap} ${half + gap + full * 1}`,
      `M ${gap} ${half + gap + full * 1} L ${gap} ${half + gap}`,
      `M ${gap} ${half + gap} L ${gap} ${gap} L ${half + gap} ${gap}`,
    ];

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    this.blocks = [];
    for (let i = 0; i < paths.length; i++) {
      let color = this.colorHelper.findColor(params[i]);
      this.blocks.push({
        curve: paths[i],
        color: color
      });
    }
  }

  /**
   * Generate the image arc params for this prime
   */
  calculateArcParams() {
    let full = 115.5;
    let half = 57.75;
    let gap = 25;

    let arcs = [
      { x1: half + gap, y1: 0, x2: half + gap, y2: gap * 2 },
      { x1: half + gap + full * 1, y1: 0, x2: half + gap + full * 1, y2: gap * 2 },
      { x1: half + gap + full * 2, y1: 0, x2: half + gap + full * 2, y2: gap * 2 },
      { x1: half + gap + full * 3, y1: 0, x2: half + gap + full * 3, y2: gap * 2 },
      { x1: half + gap, y1: full * 4, x2: half + gap, y2: full * 4 + gap * 2 },
      { x1: half + gap + full * 1, y1: full * 4, x2: half + gap + full * 1, y2: full * 4 + gap * 2 },
      { x1: half + gap + full * 2, y1: full * 4, x2: half + gap + full * 2, y2: full * 4 + gap * 2 },
      { x1: half + gap + full * 3, y1: full * 4, x2: half + gap + full * 3, y2: full * 4 + gap * 2 },
      { x1: 0, y1: half + gap, x2: gap * 2, y2: half + gap },
      { x1: 0, y1: half + gap + full * 1, x2: gap * 2, y2: half + gap + full * 1 },
      { x1: 0, y1: half + gap + full * 2, x2: gap * 2, y2: half + gap + full * 2 },
      { x1: 0, y1: half + gap + full * 3, x2: gap * 2, y2: half + gap + full * 3 },
      { x1: full * 4, y1: half + gap, x2: full * 4 + gap * 2, y2: half + gap },
      { x1: full * 4, y1: half + gap + full * 1, x2: full * 4 + gap * 2, y2: half + gap + full * 1 },
      { x1: full * 4, y1: half + gap + full * 2, x2: full * 4 + gap * 2, y2: half + gap + full * 2 },
      { x1: full * 4, y1: half + gap + full * 3, x2: full * 4 + gap * 2, y2: half + gap + full * 3 },
    ];

    this.arcs = arcs;
  }

  /**
   * Generate the slice params for this prime
   */
  calculateSliceParams() {
    let slices = [
      { x1: 50, y1: 50, x2: 462, y2: 462 },
      { x1: 50, y1: 462, x2: 462, y2: 50 },
      { x1: 50, y1: 256, x2: 256, y2: 50 },
      { x1: 256, y1: 462, x2: 462, y2: 256 },
      { x1: 50, y1: 256, x2: 256, y2: 462 },
      { x1: 256, y1: 50, x2: 462, y2: 256 },
    ];

    this.slices = slices;
  }

  /**
   * Generate the cross params for this prime
   */
  calculateCrossParams() {
    let crosses = [
      { x: 153, y: 153 },
      { x: 359, y: 153 },
      { x: 359, y: 359 },
      { x: 153, y: 359 },
      { x: 256, y: 256 },
    ];

    this.crosses = crosses;
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

    let twirls = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let radius = 40 + params[i] * 2;

      let center = this.crosses[0];
      if (i < 4) {
        center = this.crosses[0];
      } else if (i < 8) {
        center = this.crosses[1];
      } else if (i < 12) {
        center = this.crosses[2];
      } else {
        center = this.crosses[3];
      }

      let color = this.colorHelper.findColor(params[i]);

      twirls.push({
        x: center.x,
        y: center.y,
        radius: radius,
        color: color
      });
    }

    this.twirls = [
      ...twirls.slice(0, 4).sort((first, second) => second.radius - first.radius),
      ...twirls.slice(4, 8).sort((first, second) => second.radius - first.radius),
      ...twirls.slice(8, 12).sort((first, second) => second.radius - first.radius),
      ...twirls.slice(12, 16).sort((first, second) => second.radius - first.radius),
    ];

    this.borders = [
      { x: this.crosses[0].x, y: this.crosses[0].y, radius: Math.max(...twirls.slice(0, 4).map(t => t.radius)) },
      { x: this.crosses[1].x, y: this.crosses[1].y, radius: Math.max(...twirls.slice(4, 8).map(t => t.radius)) },
      { x: this.crosses[2].x, y: this.crosses[2].y, radius: Math.max(...twirls.slice(8, 12).map(t => t.radius)) },
      { x: this.crosses[3].x, y: this.crosses[3].y, radius: Math.max(...twirls.slice(12, 16).map(t => t.radius)) }
    ];
  }
}
