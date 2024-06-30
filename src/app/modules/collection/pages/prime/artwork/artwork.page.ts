import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper, SkinHelper, ThemeHelper } from '@lib/helpers';
import { GenOnePrimeRepaintContract, GenTwoPrimeRepaintContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-artwork',
  templateUrl: './artwork.page.html',
  styleUrls: ['./artwork.page.scss'],
})
export class CollectionPrimeArtworkPage implements OnInit, OnChanges {

  /**
   * App state
   */
  @Input() app: AppModel = new AppModel();

  /**
   * Data state
   */
  @Input() data: DataModel = new DataModel();

  /**
   * Prime details
   */
  @Input() prime: PrimeModel = new PrimeModel();

  /**
   * Preview prime details
   */
  @Input() previewPrime: PrimeModel = new PrimeModel();

  /**
   * List of skins
   */
  skins: Array<any> = [];

  /**
   * List of themes
   */
  themes: Array<any> = [];

  /**
   * Whether details are initialised
   */
  isInitialised: boolean = false;

  /**
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether prime asset is owned by current wallet
   */
  isPrimeOwner: boolean = false;

  /**
   * Id of selected theme
   */
  selectedThemeId: number = 0;

  /**
   * Name of selected theme
   */
  selectedThemeName: string = 'Select Theme';

  /**
   * Id of selected skin
   */
  selectedSkinId: number = 0;

  /**
   * Name of selected skin
   */
  selectedSkinName: string = 'Select Skin';

  /**
   * Price of repainting
   */
  repaintPrice: number = 0;

  /**
   * Score gained by repainting
   */
  repaintScore: number = 0;

  /**
   * Score gained by parent
   */
  parentScore: number = 0;

  /**
   * Tracking actions
   */
  actions = {
    repaintPrime: false,
  };

  /**
   * Construct component
   *
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   * @param skinHelper
   * @param themeHelper
   */
  constructor(
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper,
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
   * Component parameters changed
   */
  ngOnChanges() {
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
    if (this.prime) {
      this.isConnected = this.app.account ? true : false;
      this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;

      if (!this.isInitialised) {
        this.selectedThemeId = this.prime.theme;
        this.selectedThemeName = this.prime.theme_text;
        this.selectedSkinId = this.prime.skin;
        this.selectedSkinName = this.prime.skin_text;

        let previewPrime = new PrimeModel();
        previewPrime.gen = this.prime.gen;
        previewPrime.name = this.prime.name;
        previewPrime.theme = this.prime.theme;
        previewPrime.skin = this.prime.skin;
        this.previewPrime = previewPrime;

        this.isInitialised = true;
      }

      if (this.prime.gen == 1) {
        this.repaintPrice = environment.gen1.repaint_price;
        this.repaintScore = environment.gen1.repaint_score;
        this.parentScore = 0;
      } else {
        this.repaintPrice = environment.gen2.repaint_price;
        this.repaintScore = environment.gen2.repaint_score;
        this.parentScore = this.repaintScore / environment.gen2.parent_score_share;
      }
    }
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
    previewPrime.gen = this.prime.gen;
    previewPrime.name = this.prime.name;
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

  /**
   * Repaint prime
   */
  repaintPrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let repaintContract: any = null;
    let repaintContractId: number = 0;
    let repaintTransactionFee: number = 0;
    let repaintForeignApps: Array<number> = [];

    if (this.prime.gen == 1) {
      repaintContract = new baseClient.ABIContract(GenOnePrimeRepaintContract);
      repaintContractId = environment.gen1.contracts.prime.repaint.application_id;
      repaintTransactionFee = 3000;
      repaintForeignApps = [];
    } else {
      repaintContract = new baseClient.ABIContract(GenTwoPrimeRepaintContract);
      repaintContractId = environment.gen2.contracts.prime.repaint.application_id;
      repaintTransactionFee = 4000;
      repaintForeignApps = [this.prime.parent_application_id];
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: repaintContractId,
        method: this.chainHelper.getMethod(repaintContract, 'repaint'),
        methodArgs: [
          this.selectedThemeId,
          this.selectedSkinId,
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        appForeignApps: repaintForeignApps,
        suggestedParams: {
          ...params,
          fee: repaintTransactionFee,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: environment.platform.reserve,
          assetIndex: this.prime.platform_asset_id,
          amount: this.repaintPrice,
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.repaintPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.repaintPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Artwork updated successfully');
        }
      });
    });
  }
}
