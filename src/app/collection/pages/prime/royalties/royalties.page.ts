import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeAppContract, GenOnePrimeWithdrawContract, GenTwoPrimeAppContract, GenTwoPrimeWithdrawContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-royalties',
  templateUrl: './royalties.page.html',
  styleUrls: ['./royalties.page.scss'],
})
export class CollectionPrimeRoyaltiesPage implements OnInit, OnChanges {

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
    }
  }

  /**
   * Withdraw royalties
   */
  withdrawPrime() {
    if (this.inputs.withdraw * Math.pow(10, 6) > this.prime.royalties) {
      this.appHelper.showError('Cannot withdraw more than the available royalties');
      return;
    }

    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let withdrawContract: any = null;
    let withdrawContractId = 0;

    if (this.prime.gen == 1) {
      withdrawContract = new baseClient.ABIContract(GenOnePrimeWithdrawContract);
      withdrawContractId = environment.gen1.contracts.prime.withdraw.application_id;
    } else {
      withdrawContract = new baseClient.ABIContract(GenTwoPrimeWithdrawContract);
      withdrawContractId = environment.gen2.contracts.prime.withdraw.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: withdrawContractId,
        method: this.chainHelper.getMethod(withdrawContract, 'withdraw'),
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
          this.appHelper.showSuccess('Royalties withdrawn successfully');
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
        txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.application_address,
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
          this.appHelper.showSuccess('Royalties deposited successfully');
        }
      });
    });
  }
}
