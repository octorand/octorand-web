import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeAppContract, GenTwoPrimeAppContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-rewards',
  templateUrl: './rewards.page.html',
  styleUrls: ['./rewards.page.scss'],
})
export class CollectionPrimeRewardsPage implements OnInit, OnChanges {

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
    donation: 10,
  };

  /**
   * Tracking actions
   */
  actions = {
    withdrawPrime: false,
    depositPrime: false,
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
   * Withdraw rewards
   */
  withdrawPrime() {

  }

  /**
   * Deposit rewards
   */
  depositPrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let appContract: any = null;

    if (this.prime.gen == 1) {
      appContract = new baseClient.ABIContract(GenOnePrimeAppContract);
    } else {
      appContract = new baseClient.ABIContract(GenTwoPrimeAppContract);
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.application_address,
          assetIndex: this.prime.platform_asset_id,
          amount: Number(this.inputs.donation) * Math.pow(10, 6),
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

      composer.addMethodCall({
        sender: this.app.account,
        appID: this.prime.application_id,
        method: this.chainHelper.getMethod(appContract, 'refresh'),
        methodArgs: [],
        appForeignAssets: [
          this.prime.platform_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 1000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.depositPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.depositPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Rewards deposited successfully');
        }
      });
    });
  }
}
