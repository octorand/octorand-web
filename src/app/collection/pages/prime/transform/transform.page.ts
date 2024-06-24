import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeRenameContract, GenTwoPrimeRenameContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-transform',
  templateUrl: './transform.page.html',
  styleUrls: ['./transform.page.scss'],
})
export class CollectionPrimeTransformPage implements OnInit, OnChanges {

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
   * Index of selected name letter
   */
  selectedNameIndex: number = 0;

  /**
   * Index of selected alphabet letter
   */
  selectedLetterIndex: number = 0;

  /**
   * Price of renaming
   */
  renamePrice: number = 0;

  /**
   * Score gained by renaming
   */
  renameScore: number = 0;

  /**
   * Score gained by parent
   */
  parentScore: number = 0;

  /**
   * Difference between letters when renaming
   */
  renameDifference: number = 0;

  /**
   * Updated prime name
   */
  updatedName: string = '';

  /**
   * Tracking actions
   */
  actions = {
    renamePrime: false,
  };

  /**
   * Construct component
   *
   * @param appHelper
   * @param chainHelper
   * @param dataHelper
   */
  constructor(
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.refreshView();
  }

  /**
   * Component parameters changed
   */
  ngOnChanges() {
    this.refreshView();
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {
      this.isConnected = this.app.account ? true : false;
      this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;

      if (this.prime.gen == 1) {
        this.renamePrice = environment.gen1.rename_price;
        this.renameScore = environment.gen1.rename_score;
        this.parentScore = 0;
      } else {
        this.renamePrice = environment.gen2.rename_price;
        this.renameScore = environment.gen2.rename_score;
        this.parentScore = this.renameScore / environment.gen2.parent_score_share;
      }

      if (!this.isInitialised) {
        this.updatedName = this.prime.name;
        this.isInitialised = true;
      }
    }
  }

  /**
   * Select name index
   *
   * @param index
   */
  selectNameIndex(index: number) {
    if (this.selectedNameIndex != index) {
      this.updatedName = this.prime.name;
      this.selectedNameIndex = index;
      this.selectedLetterIndex = this.prime.name.charCodeAt(index);
      this.renameDifference = 0;
    }
  }

  /**
   * Roll up letter index
   *
   * @param index
   */
  upLetterIndex(index: number) {
    this.selectNameIndex(index);
    if (this.selectedLetterIndex > 65) {
      this.selectedLetterIndex = this.selectedLetterIndex - 1;
      this.updatedName = this.updatedName.substring(0, index) + String.fromCharCode(this.selectedLetterIndex) + this.updatedName.substring(index + 1);
    }

    this.renameDifference = Math.abs(this.prime.name.charCodeAt(index) - this.updatedName.charCodeAt(index));
  }

  /**
   * Roll down letter index
   *
   * @param index
   */
  downLetterIndex(index: number) {
    this.selectNameIndex(index);
    if (this.selectedLetterIndex < 90) {
      this.selectedLetterIndex = this.selectedLetterIndex + 1;
      this.updatedName = this.updatedName.substring(0, index) + String.fromCharCode(this.selectedLetterIndex) + this.updatedName.substring(index + 1);
    }

    this.renameDifference = Math.abs(this.prime.name.charCodeAt(index) - this.updatedName.charCodeAt(index));
  }

  /**
   * Rename prime
   */
  renamePrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let renameContract: any = null;
    let renameContractId: number = 0;
    let renameTransactionFee: number = 0;
    let renameForeignApps: Array<number> = [];

    if (this.prime.gen == 1) {
      renameContract = new baseClient.ABIContract(GenOnePrimeRenameContract);
      renameContractId = environment.gen1.contracts.prime.rename.application_id;
      renameTransactionFee = 3000;
      renameForeignApps = [];
    } else {
      renameContract = new baseClient.ABIContract(GenTwoPrimeRenameContract);
      renameContractId = environment.gen2.contracts.prime.rename.application_id;
      renameTransactionFee = 4000;
      renameForeignApps = [this.prime.parent_application_id];
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: renameContractId,
        method: this.chainHelper.getMethod(renameContract, 'rename'),
        methodArgs: [
          this.selectedNameIndex,
          this.selectedLetterIndex,
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        appForeignApps: renameForeignApps,
        suggestedParams: {
          ...params,
          fee: renameTransactionFee,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: environment.platform.reserve,
          assetIndex: this.prime.platform_asset_id,
          amount: this.renamePrice * this.renameDifference,
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

      this.actions.renamePrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.renamePrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Name updated successfully');
        }
      });
    });
  }
}
