import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-0',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenTwoTag0 implements OnInit, OnChanges {

  shades: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
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
    this.calculateArcParams();
    this.calculateSliceParams();
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
   * Generate the arm params for this prime
   */
  calculateArmParams() {
    let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    let params = [];
    for (let j = 0; j < this.prime.name.length; j++) {
      params.push(alphabet.indexOf(this.prime.name.charAt(j)));
    }

    let centers = [
      { x: 153, y: 153 },
      { x: 359, y: 153 },
      { x: 359, y: 359 },
      { x: 153, y: 359 },
    ]

    this.arms = [];
    for (let i = 0; i < this.prime.name.length; i++) {
      let angle = (((i % 4) + 1) * 360 / 4) - 135;
      let slope = angle * Math.PI / 180;
      let radius = 50 + params[i] * 2;

      let center = centers[0];
      if (i < 4) {
        center = centers[0];
      } else if (i < 8) {
        center = centers[1];
      } else if (i < 12) {
        center = centers[2];
      } else {
        center = centers[3];
      }

      let nx = Math.cos(slope) * radius + center.x;
      let ny = Math.sin(slope) * radius + center.y;
      let color = this.colorHelper.findColor(params[i]);

      this.arms.push({
        x: nx,
        y: ny,
        color: color
      });
    }
  }
}
