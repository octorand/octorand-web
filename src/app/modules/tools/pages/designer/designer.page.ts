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
   * Selected theme
   */
  selectedTheme: number = 0;

  /**
   * Selected skin
   */
  selectedSkin: number = 0;

  /**
   * Selected name
   */
  selectedName: string = 'AAAAAAAAAAAAAAAA';

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
    this.updatePreviewPrime();
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
   * Roll up letter index
   *
   * @param index
   */
  upLetterIndex(index: number) {
    let selectedLetterIndex = this.selectedName.charCodeAt(index);
    if (selectedLetterIndex > 65) {
      selectedLetterIndex = selectedLetterIndex - 1;
      this.selectedName = this.selectedName.substring(0, index) + String.fromCharCode(selectedLetterIndex) + this.selectedName.substring(index + 1);
    }

    this.updatePreviewPrime();
  }

  /**
   * Roll down letter index
   *
   * @param index
   */
  downLetterIndex(index: number) {
    let selectedLetterIndex = this.selectedName.charCodeAt(index);
    if (selectedLetterIndex < 90) {
      selectedLetterIndex = selectedLetterIndex + 1;
      this.selectedName = this.selectedName.substring(0, index) + String.fromCharCode(selectedLetterIndex) + this.selectedName.substring(index + 1);
    }

    this.updatePreviewPrime();
  }

  /**
   * Update preview prime
   */
  updatePreviewPrime() {
    let previewPrime = new PrimeModel();
    previewPrime.gen = this.selectedGen;
    previewPrime.theme = this.selectedTheme;
    previewPrime.skin = this.selectedSkin;
    previewPrime.name = this.selectedGen == 1 ? this.selectedName.substring(0, 8) : this.selectedName.substring(0, 16);
    this.previewPrime = previewPrime;
  }
}
