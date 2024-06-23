import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { GenOnePrimeClaimContract, GenOnePrimeUpgradeContract, GenTwoPrimeClaimContract, GenTwoPrimeUpgradeContract } from '@lib/contracts';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class CollectionPrimeSummaryPage implements OnInit, OnChanges {

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
   * Whether wallet is opted into prime asset
   */
  isOptedIn: boolean = false;

  /**
   * Whether prime asset is owned by current wallet
   */
  isPrimeOwner: boolean = false;

  /**
   * Whether legacy asset is owned by current wallet
   */
  isLegacyOwner: boolean = false;

  /**
   * Whether prime is optinable
   */
  isOptinable: boolean = false;

  /**
   * Whether prime is claimable
   */
  isClaimable: boolean = false;

  /**
   * Whether prime is upgradable
   */
  isUpgradable: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    optinPrime: false,
    claimPrime: false,
    upgradePrime: false,
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
      this.isOptedIn = this.app.assets.find(a => a.id == this.prime.prime_asset_id) ? true : false;
      this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;
      this.isLegacyOwner = this.app.assets.find(a => a.id == this.prime.legacy_asset_id && a.amount > 0) ? true : false;
      this.isOptinable = (this.isConnected && !this.isOptedIn) ? true : false;
      this.isClaimable = (this.isPrimeOwner && this.prime.owner != this.app.account) ? true : false;
      this.isUpgradable = this.prime.badges.includes('Explorer') ? false : true;
    }
  }

  /**
   * Optin to prime asset
   */
  optinPrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.app.account,
          assetIndex: this.prime.prime_asset_id,
          amount: 0,
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

      this.actions.optinPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.optinPrime = false;
        if (response.success) {
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Opted into prime asset successfully');
        }
      });
    });
  }

  /**
   * Claim prime
   */
  claimPrime() {
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

      this.actions.claimPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.claimPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.showSuccess('Claimed prime successfully');
        }
      });
    });
  }

  /**
   * Upgrade prime
   */
  upgradePrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let upgradeContract: any = null;
    let upgradeContractId = 0;

    if (this.prime.gen == 1) {
      upgradeContract = new baseClient.ABIContract(GenOnePrimeUpgradeContract);
      upgradeContractId = environment.gen1.contracts.prime.upgrade.application_id;
    } else {
      upgradeContract = new baseClient.ABIContract(GenTwoPrimeUpgradeContract);
      upgradeContractId = environment.gen2.contracts.prime.upgrade.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.isOptedIn) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.app.account,
            assetIndex: this.prime.prime_asset_id,
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
        appID: upgradeContractId,
        method: this.chainHelper.getMethod(upgradeContract, 'upgrade'),
        methodArgs: [
          this.prime.application_id,
        ],
        appForeignAssets: [
          this.prime.prime_asset_id,
        ],
        suggestedParams: {
          ...params,
          fee: 3000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.application_address,
          assetIndex: this.prime.legacy_asset_id,
          amount: 1,
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

      this.actions.upgradePrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.upgradePrime = false;
        if (response.success) {
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Upgraded prime successfully');
        }
      });
    });
  }
}
