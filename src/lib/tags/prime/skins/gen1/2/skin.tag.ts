import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { ColorHelper, SkinHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'lib-tags-prime-skins-gen1-2',
  templateUrl: './skin.tag.html',
  styleUrls: ['./skin.tag.scss'],
})
export class PrimeSkinsGenOneTag2 implements OnInit, OnChanges {

  shades: Array<any> = [];
  params: Array<any> = [];
  blocks: Array<any> = [];
  arcs: Array<any> = [];
  slices: Array<any> = [];
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

    let info = this.skinHelper.genOne(prime, colors);
    this.shades = info.shades;
    this.params = info.params;
    this.blocks = info.blocks;
    this.arcs = info.arcs;
    this.slices = info.slices;

    let twirls = [];
    for (let i = 0; i < prime.name.length; i++) {
      let radius = 50 + this.params[i] * 5;
      let color = colors.findColor(this.params[i]);

      twirls.push({
        radius: radius,
        color: color
      });
    }

    twirls.sort((first, second) => second.radius - first.radius);

    let borders = [
      { radius: Math.max(...twirls.slice(0, 8).map(t => t.radius)) }
    ];

    this.twirls = twirls;
    this.borders = borders;
  }
}
