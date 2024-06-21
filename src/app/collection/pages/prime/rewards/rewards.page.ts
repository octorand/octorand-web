import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeClaimContract, GenTwoPrimeClaimContract } from '@lib/contracts';
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
   * Tracking actions
   */
  actions = {
    withdrawRewards: false,
    withdrawRoyalties: false,
    depositRewards: false,
    depositRoyalties: false
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
  withdrawRewards() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let claimContract: any = null;
    let claimContractId = 0;

    if (this.prime.gen == 1) {
      claimContract = new baseClient.ABIContract(GenOnePrimeClaimContract);
      claimContractId = environment.gen1.contracts.prime.claim.application_id;
    } else {
      claimContract = new baseClient.ABIContract(GenTwoPrimeClaimContract);
      claimContractId = environment.gen2.contracts.prime.claim.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: claimContractId,
        method: this.chainHelper.getMethod(claimContract, 'claim'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.withdrawRewards = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.withdrawRewards = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Rewards withdrawn successfully');
        }
      });
    });
  }

  /**
   * Withdraw royalties
   */
  withdrawRoyalties() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let claimContract: any = null;
    let claimContractId = 0;

    if (this.prime.gen == 1) {
      claimContract = new baseClient.ABIContract(GenOnePrimeClaimContract);
      claimContractId = environment.gen1.contracts.prime.claim.application_id;
    } else {
      claimContract = new baseClient.ABIContract(GenTwoPrimeClaimContract);
      claimContractId = environment.gen2.contracts.prime.claim.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: claimContractId,
        method: this.chainHelper.getMethod(claimContract, 'claim'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.withdrawRoyalties = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.withdrawRoyalties = false;
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
  depositRewards() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let claimContract: any = null;
    let claimContractId = 0;

    if (this.prime.gen == 1) {
      claimContract = new baseClient.ABIContract(GenOnePrimeClaimContract);
      claimContractId = environment.gen1.contracts.prime.claim.application_id;
    } else {
      claimContract = new baseClient.ABIContract(GenTwoPrimeClaimContract);
      claimContractId = environment.gen2.contracts.prime.claim.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: claimContractId,
        method: this.chainHelper.getMethod(claimContract, 'claim'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.depositRewards = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.depositRewards = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Rewards deposited successfully');
        }
      });
    });
  }

  /**
   * Deposit royalties
   */
  depositRoyalties() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let claimContract: any = null;
    let claimContractId = 0;

    if (this.prime.gen == 1) {
      claimContract = new baseClient.ABIContract(GenOnePrimeClaimContract);
      claimContractId = environment.gen1.contracts.prime.claim.application_id;
    } else {
      claimContract = new baseClient.ABIContract(GenTwoPrimeClaimContract);
      claimContractId = environment.gen2.contracts.prime.claim.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.account,
        appID: claimContractId,
        method: this.chainHelper.getMethod(claimContract, 'claim'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 2000,
          flatFee: true
        }
      });

      let group = composer.buildGroup();

      let transactions = [];
      for (let i = 0; i < group.length; i++) {
        transactions.push(group[i].txn);
      }

      this.actions.depositRoyalties = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.depositRoyalties = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Royalties deposited successfully');
        }
      });
    });
  }
}
