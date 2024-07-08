import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper, SkinHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-2',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenTwoTag2 implements OnInit, OnChanges {

  shades: Array<any> = [];
  params: Array<any> = [];
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

    let twirls = [];
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

      let color = colors.findColor(this.params[i]);

      twirls.push({
        x: center.x,
        y: center.y,
        radius: radius,
        color: color
      });
    }

    twirls = [
      ...twirls.slice(0, 4).sort((first, second) => second.radius - first.radius),
      ...twirls.slice(4, 8).sort((first, second) => second.radius - first.radius),
      ...twirls.slice(8, 12).sort((first, second) => second.radius - first.radius),
      ...twirls.slice(12, 16).sort((first, second) => second.radius - first.radius),
    ];

    let borders = [
      { x: this.crosses[0].x, y: this.crosses[0].y, radius: Math.max(...twirls.slice(0, 4).map(t => t.radius)) },
      { x: this.crosses[1].x, y: this.crosses[1].y, radius: Math.max(...twirls.slice(4, 8).map(t => t.radius)) },
      { x: this.crosses[2].x, y: this.crosses[2].y, radius: Math.max(...twirls.slice(8, 12).map(t => t.radius)) },
      { x: this.crosses[3].x, y: this.crosses[3].y, radius: Math.max(...twirls.slice(12, 16).map(t => t.radius)) }
    ];

    this.twirls = twirls;
    this.borders = borders;
  }
}
