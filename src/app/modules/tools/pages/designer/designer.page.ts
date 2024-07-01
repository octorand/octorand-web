import { Component, OnInit } from '@angular/core';
import { SkinHelper, ThemeHelper } from '@lib/helpers';
import { PrimeModel } from '@lib/models';

@Component({
  selector: 'app-tools-designer',
  templateUrl: './designer.page.html',
  styleUrls: ['./designer.page.scss'],
})
export class ToolsDesignerPage implements OnInit {

  /**
   * Preview prime details
   */
  previewPrime: PrimeModel = new PrimeModel();

  /**
   * List of skins
   */
  skins: Array<any> = [];

  /**
   * List of themes
   */
  themes: Array<any> = [];

  /**
   * Selected generation
   */
  selectedGen: number = 1;

  /**
   * Id of selected theme
   */
  selectedTheme: number = 0;

  /**
   * Id of selected skin
   */
  selectedSkin: number = 0;

  /**
   * Construct component
   *
   * @param skinHelper
   * @param themeHelper
   */
  constructor(
    private skinHelper: SkinHelper,
    private themeHelper: ThemeHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initSkins();
    this.initThemes();
    this.refreshView();
  }

  /**
   * Initialize skins
   */
  initSkins() {
    this.skins = this.skinHelper.list();
  }

  /**
   * Initialize themes
   */
  initThemes() {
    this.themes = this.themeHelper.list();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    let previewPrime = new PrimeModel();
    previewPrime.gen = this.selectedGen;
    previewPrime.theme = this.selectedTheme;
    previewPrime.skin = this.selectedSkin;
    previewPrime.name = 'AAAAAAAA';
    this.previewPrime = previewPrime;
  }

  /**
   * When gen is changed
   *
   * @param gen
   */
  changeGen(gen: number) {
    this.selectedGen = gen;
    this.updatePreviewPrime();
  }

  /**
   * When theme is changed
   *
   * @param theme
   */
  changeTheme(theme: number) {
    this.selectedTheme = theme;
    this.updatePreviewPrime();
  }

  /**
   * When skin is changed
   *
   * @param skin
   */
  changeSkin(skin: number) {
    this.selectedSkin = skin;
    this.updatePreviewPrime()
  }

  /**
   * Update preview prime
   */
  updatePreviewPrime() {
    let previewPrime = new PrimeModel();
    previewPrime.gen = this.selectedGen;
    previewPrime.theme = this.selectedTheme;
    previewPrime.skin = this.selectedSkin;
    previewPrime.name = 'OCTORAND';
    this.previewPrime = previewPrime;
  }
}
