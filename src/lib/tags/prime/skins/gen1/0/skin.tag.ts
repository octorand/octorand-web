import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper, SkinHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen1-0',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenOneTag0 implements OnInit, OnChanges {

  shades: Array<any> = [];
  params: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
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

    let info = this.skinHelper.genOne(prime, colors);
    let shades = info.shades;
    let params = info.params;
    let blocks = info.blocks;
    let arcs = info.arcs;
    let slices = info.slices;

    let arms = [];
    for (let i = 0; i < prime.name.length; i++) {
      let angle = (i + 1) * 360 / prime.name.length;
      let slope = angle * Math.PI / 180;
      let radius = 50 + params[i] * 5;

      let nx = Math.cos(slope) * radius + 256;
      let ny = Math.sin(slope) * radius + 256;
      let color = colors.findColor(params[i]);

      arms.push({
        x: nx,
        y: ny,
        color: color
      });
    }

    this.shades = shades;
    this.params = params;
    this.blocks = blocks;
    this.arcs = arcs;
    this.slices = slices;
    this.arms = arms;
  }
}
