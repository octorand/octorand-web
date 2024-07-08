import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper, SkinHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-0',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenTwoTag0 implements OnInit, OnChanges {

  shades: Array<any> = [];
  params: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
  crosses: Array<any> = [];
  arms: Array<any> = [];

  /**
  * The prime parameters
  */
  @Input() prime: PrimeModel = new PrimeModel();

  /**
   * Construct component
   *
   * @param colorHelper
   * @param skinHelper
   */
  constructor(
    private colorHelper: ColorHelper,
    private skinHelper: SkinHelper
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
    let prime = this.prime;
    let colors = this.colorHelper;

    let info = this.skinHelper.genTwo(prime, colors);
    this.shades = info.shades;
    this.params = info.params;
    this.blocks = info.blocks;
    this.arcs = info.arcs;
    this.slices = info.slices;
    this.crosses = info.crosses;

    let arms = [];
    for (let i = 0; i < prime.name.length; i++) {
      let radius = 40 + this.params[i] * 2;

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

      let angle = (((i % 4) + 1) * 360 / 4) - 135;
      let slope = angle * Math.PI / 180;

      let nx = Math.cos(slope) * radius + center.x;
      let ny = Math.sin(slope) * radius + center.y;
      let color = colors.findColor(this.params[i]);

      arms.push({
        x: nx,
        y: ny,
        color: color
      });
    }

    this.arms = arms;
  }
}
