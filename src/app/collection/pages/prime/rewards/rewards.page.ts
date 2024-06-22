import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeAppContract, GenOnePrimeMintContract, GenTwoPrimeAppContract, GenTwoPrimeMintContract } from '@lib/contracts';
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
   * Whether current wallet is opted into platform asset
   */
  isOptedIn: boolean = false;

  /**
   * Manage inputs
   */
  inputs = {
    deposit: 10,
    withdraw: 0,
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
      this.isOptedIn = this.app.assets.find(a => a.id == this.prime.platform_asset_id) ? true : false;
    }
  }

  /**
   * Withdraw rewards
   */
  withdrawPrime() {
    if (this.inputs.withdraw * Math.pow(10, 6) > this.prime.rewards) {
      this.appHelper.showError('Cannot withdraw more than the available rewards');
      return;
    }

    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let mintContract: any = null;
    let mintContractId = 0;

    if (this.prime.gen == 1) {
      mintContract = new baseClient.ABIContract(GenOnePrimeMintContract);
      mintContractId = environment.gen1.contracts.prime.mint.application_id;
    } else {
      mintContract = new baseClient.ABIContract(GenTwoPrimeMintContract);
      mintContractId = environment.gen2.contracts.prime.mint.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.app.account,
            assetIndex: this.prime.platform_asset_id,
            amount: 0,
            suggestedParams: {
              ...params,
              fee: 1000,
              flatFee: true
            }
          })
        });
      }

      composer.addMethodCall({
        sender: this.app.account,
        appID: mintContractId,
        method: this.chainHelper.getMethod(mintContract, 'mint'),
        methodArgs: [
          Number(this.inputs.withdraw) * Math.pow(10, 6),
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
          this.prime.platform_asset_id
        ],
        suggestedParams: {
          ...params,
          fee: 3000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.withdrawPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.withdrawPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Rewards withdrawn successfully');
        }
      });
    });
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
          amount: Number(this.inputs.deposit) * Math.pow(10, 6),
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
