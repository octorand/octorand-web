import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper, SkinHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen1-1',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenOneTag1 implements OnInit, OnChanges {

  shades: Array<any> = [];
  params: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
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

    let info = this.skinHelper.genOne(prime, colors);
    this.shades = info.shades;
    this.params = info.params;
    this.blocks = info.blocks;
    this.arcs = info.arcs;
    this.slices = info.slices;

    let pies = [];
    for (let i = 0; i < prime.name.length; i++) {
      let radius = 50 + this.params[i] * 5;

      let sangle = (i + 1) * 360 / prime.name.length;
      let sslope = sangle * Math.PI / 180;
      let sx = Math.cos(sslope) * radius + 256;
      let sy = Math.sin(sslope) * radius + 256;

      let eangle = (i + 2) * 360 / prime.name.length;
      let eslope = eangle * Math.PI / 180;
      let ex = Math.cos(eslope) * radius + 256;
      let ey = Math.sin(eslope) * radius + 256;

      let move = 'M ' + sx + ' ' + sy;
      let arc = 'A ' + radius + ' ' + radius + ' 0 0 1 ' + ex + ' ' + ey;
      let line = 'L 256 256';
      let curve = move + ' ' + arc;
      let path = curve + ' ' + line;

      let color = colors.findColor(this.params[i]);

      pies.push({
        curve: curve,
        path: path,
        color: color
      });
    }

    this.pies = pies;
  }
}
