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
   * Id of selected theme
   */
  selectedThemeId: number = 0;

  /**
   * Name of selected theme
   */
  selectedThemeName: string = '';

  /**
   * Id of selected skin
   */
  selectedSkinId: number = 0;

  /**
   * Name of selected skin
   */
  selectedSkinName: string = '';

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
    this.selectedThemeName = this.themes[this.selectedThemeId].name;
    this.selectedSkinName = this.skins[this.selectedSkinId].name;

    let previewPrime = new PrimeModel();
    previewPrime.gen = 1;
    previewPrime.name = 'AAAAAAAA';
    previewPrime.theme = this.selectedThemeId;
    previewPrime.skin = this.selectedSkinId;
    this.previewPrime = previewPrime;
  }

  /**
   * Select theme
   *
   * @param theme
   */
  selectTheme(theme: any) {
    this.selectedThemeId = theme.id;
    this.selectedThemeName = theme.name;
    this.updatePreviewPrime();
    this.hideDropdown('.select-theme-dropdown');
  }

  /**
   * Select skin
   *
   * @param skin
   */
  selectSkin(skin: any) {
    this.selectedSkinId = skin.id;
    this.selectedSkinName = skin.name;
    this.updatePreviewPrime()
    this.hideDropdown('.select-skin-dropdown');
  }

  /**
   * Update preview prime
   */
  updatePreviewPrime() {
    let previewPrime = new PrimeModel();
    previewPrime.gen = 1;
    previewPrime.name = 'OCTORAND';
    previewPrime.theme = this.selectedThemeId;
    previewPrime.skin = this.selectedSkinId;
    this.previewPrime = previewPrime;
  }

  /**
   * Hide dropdown
   */
  hideDropdown(css: string) {
    let dropdown = document.querySelector(css);
    if (dropdown) {
      dropdown.classList.remove('show');

      let button = dropdown.querySelector('.btn');
      if (button) {
        button.classList.remove('active');
      }
    }
  }
}
