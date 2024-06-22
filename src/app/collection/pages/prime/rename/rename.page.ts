import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeRenameContract, GenTwoPrimeRenameContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-rename',
  templateUrl: './rename.page.html',
  styleUrls: ['./rename.page.scss'],
})
export class CollectionPrimeRenamePage implements OnInit, OnChanges {

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
   * Whether a wallet is connected
   */
  isConnected: boolean = false;

  /**
   * Whether prime asset is owned by current wallet
   */
  isPrimeOwner: boolean = false;

  /**
   * Manage inputs
   */
  inputs = {
    index: null,
    letter: null
  };

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
    }
  }

  /**
   * Rename prime
   */
  renamePrime() {
    if (!this.inputs.index) {
      this.appHelper.showError('Please enter the index');
      return;
    }

    if (Number.isNaN(this.inputs.index)) {
      this.appHelper.showError('Please enter the index');
      return;
    }

    if (!this.inputs.letter) {
      this.appHelper.showError('Please enter the letter');
      return;
    }

    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let renameContract: any = null;
    let renameContractId: number = 0;
    let renameCost: number = 0;
    let renameTransactionFee: number = 0;
    let renameForeignApps: Array<number> = [];
    let renameDiff = Math.abs(this.prime.name.charCodeAt(this.inputs.index - 1) - String(this.inputs.letter).charCodeAt(0));

    if (this.prime.gen == 1) {
      renameContract = new baseClient.ABIContract(GenOnePrimeRenameContract);
      renameContractId = environment.gen1.contracts.prime.rename.application_id;
      renameCost = 10000000 * renameDiff;
      renameTransactionFee = 3000;
      renameForeignApps = [];
    } else {
      renameContract = new baseClient.ABIContract(GenTwoPrimeRenameContract);
      renameContractId = environment.gen2.contracts.prime.rename.application_id;
      renameCost = 1000000 * renameDiff;
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
          Number(this.inputs.index) - 1,
          String(this.inputs.letter).charCodeAt(0),
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
          amount: renameCost,
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
