import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { GenOnePrimeAppContract, GenOnePrimeUpgradeContract, GenTwoPrimeAppContract, GenTwoPrimeUpgradeContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-upgrade',
  templateUrl: './upgrade.page.html',
  styleUrls: ['./upgrade.page.scss'],
})
export class CollectionPrimeUpgradePage implements OnInit, OnChanges {

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
   * Whether legacy asset is owned by current wallet
   */
  isLegacyOwner: boolean = false;

  /**
   * Whether prime is upgradable
   */
  isUpgradable: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    upgradePrime: false,
  };

  /**
   * Construct component
   *
   * @param appHelper
   * @param chainHelper
   */
  constructor(
    private appHelper: AppHelper,
    private chainHelper: ChainHelper
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
      this.isLegacyOwner = this.app.assets.find(a => a.id == this.prime.legacy_asset_id && a.amount > 0) ? true : false;
      this.isUpgradable = this.prime.badges.includes('Explorer') ? false : true;
    }
  }

  /**
   * Upgrade prime
   */
  upgradePrime() {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let appContract = null;
    let upgradeContract = null;
    let upgradeContractId = 0;

    if (this.prime.gen == 1) {
      appContract = new baseClient.ABIContract(GenOnePrimeAppContract);
      upgradeContract = new baseClient.ABIContract(GenOnePrimeUpgradeContract);
      upgradeContractId = environment.gen1.contracts.prime.upgrade.application_id;
    } else {
      appContract = new baseClient.ABIContract(GenTwoPrimeAppContract);
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
