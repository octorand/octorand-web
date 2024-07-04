import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeAppContract, GenOnePrimeMintContract, GenOnePrimeWithdrawContract, GenTwoPrimeAppContract, GenTwoPrimeMintContract, GenTwoPrimeWithdrawContract } from '@lib/contracts';
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
   * Whether prime asset is listed for sale by current wallet
   */
  isListedOwner: boolean = false;

  /**
   * Whether current wallet is opted into platform asset
   */
  isOptedIn: boolean = false;

  /**
   * Manage inputs
   */
  inputs = {
    depositALGO: 10,
    depositOCTO: 10,
    withdrawALGO: 0,
    withdrawOCTO: 0,
  };

  /**
   * Tracking actions
   */
  actions = {
    depositALGO: false,
    depositOCTO: false,
    withdrawALGO: false,
    withdrawOCTO: false,
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
      this.isListedOwner = (this.prime.is_listed && this.prime.seller == this.app.account) ? true : false;
      this.isOptedIn = this.app.assets.find(a => a.id == this.prime.platform_asset_id) ? true : false;
    }
  }

  /**
   * Deposit OCTO
   */
  depositOCTO() {
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
          amount: Number(this.inputs.depositOCTO) * Math.pow(10, 6),
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

      this.actions.depositOCTO = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.depositOCTO = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Rewards deposited successfully');
        }
      });
    });
  }

  /**
   * Deposit ALGO
   */
  depositALGO() {
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
          amount: Number(this.inputs.depositALGO) * Math.pow(10, 6),
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

      this.actions.depositALGO = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.depositALGO = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Royalties deposited successfully');
        }
      });
    });
  }

  /**
   * Withdraw OCTO
   */
  withdrawOCTO() {
    if (this.inputs.withdrawOCTO * Math.pow(10, 6) > this.prime.rewards) {
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
          Number(this.inputs.withdrawOCTO) * Math.pow(10, 6),
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

      this.actions.withdrawOCTO = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.withdrawOCTO = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Rewards withdrawn successfully');
        }
      });
    });
  }

  /**
   * Withdraw ALGO
   */
  withdrawALGO() {
    if (this.inputs.withdrawALGO * Math.pow(10, 6) > this.prime.royalties) {
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
          Number(this.inputs.withdrawALGO) * Math.pow(10, 6),
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

      this.actions.withdrawALGO = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.withdrawALGO = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Royalties withdrawn successfully');
        }
      });
    });
  }
}
