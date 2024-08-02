import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper, SkinHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen2-1',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenTwoTag1 implements OnInit, OnChanges {

  shades: Array<any> = [];
  params: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
  crosses: Array<any> = [];
  pies: Array<any> = [];

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
    let shades = info.shades;
    let params = info.params;
    let blocks = info.blocks;
    let arcs = info.arcs;
    let slices = info.slices;
    let crosses = info.crosses;

    let pies = [];
    for (let i = 0; i < prime.name.length; i++) {
      let radius = 40 + params[i] * 2;

      let center = crosses[0];
      if (i < 4) {
        center = crosses[0];
      } else if (i < 8) {
        center = crosses[1];
      } else if (i < 12) {
        center = crosses[2];
      } else {
        center = crosses[3];
      }

      let sangle = (((i % 4) + 1) * 360 / 4) - 135;
      let sslope = sangle * Math.PI / 180;
      let sx = Math.cos(sslope) * radius + center.x;
      let sy = Math.sin(sslope) * radius + center.y;

      let eangle = (((i % 4) + 2) * 360 / 4) - 135;
      let eslope = eangle * Math.PI / 180;
      let ex = Math.cos(eslope) * radius + center.x;
      let ey = Math.sin(eslope) * radius + center.y;

      let move = 'M ' + sx + ' ' + sy;
      let arc = 'A ' + radius + ' ' + radius + ' 0 0 1 ' + ex + ' ' + ey;
      let line = 'L ' + center.x + ' ' + center.y;
      let curve = move + ' ' + arc;
      let path = curve + ' ' + line;

      let color = colors.findColor(params[i]);

      pies.push({
        curve: curve,
        path: path,
        color: color
      });
    }

    this.shades = shades;
    this.params = params;
    this.blocks = blocks;
    this.arcs = arcs;
    this.slices = slices;
    this.crosses = crosses;
    this.pies = pies;
  }
}
