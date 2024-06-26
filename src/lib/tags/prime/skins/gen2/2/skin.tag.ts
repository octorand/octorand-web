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
  twirls: Array<any> = [];

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

      this.twirls.sort((first, second) => second.radius - first.radius);
    }
  }
}
