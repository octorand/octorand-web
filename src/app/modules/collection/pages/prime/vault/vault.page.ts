import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AppHelper, AssetHelper, ChainHelper, DataHelper, IndexerHelper } from '@lib/helpers';
import { GenOnePrimeOptinContract, GenOnePrimeOptoutContract, GenTwoPrimeOptinContract, GenTwoPrimeOptoutContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-vault',
  templateUrl: './vault.page.html',
  styleUrls: ['./vault.page.scss'],
})
export class CollectionPrimeVaultPage implements OnInit, OnChanges, OnDestroy {

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
   * List of assets that can be deposited
   */
  depositableAssets: Array<any> = [];

  /**
   * List of assets that have been deposited
   */
  vaultedAssets: Array<any> = [];

  /**
   * Id of selected asset
   */
  selectedAssetId: number = 0;

  /**
   * Name of selected asset
   */
  selectedAssetName: string = 'Select Asset';

  /**
   * Decimals of selected asset
   */
  selectedAssetDecimals: number = 0;

  /**
   * Manage inputs
   */
  inputs = {
    amount: null,
  };

  /**
   * Tracking actions
   */
  actions = {
    withdrawPrime: 0,
    depositPrime: false,
  };

  /**
     * Track vault details loading task
     */
  private vaultDetailsLoadTask: any = null;

  /**
   * Construct component
   *
   * @param appHelper
   * @param assetHelper
   * @param chainHelper
   * @param dataHelper
   * @param indexerHelper
   */
  constructor(
    private appHelper: AppHelper,
    private assetHelper: AssetHelper,
    private chainHelper: ChainHelper,
    private dataHelper: DataHelper,
    private indexerHelper: IndexerHelper
  ) {
    this.initTasks();
  }

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
   * Destroy component
   */
  ngOnDestroy() {
    clearInterval(this.vaultDetailsLoadTask);
  }

  /**
   * Initialize tasks
   */
  initTasks() {
    this.loadVaultDetails();
    this.vaultDetailsLoadTask = setInterval(() => { this.loadVaultDetails() }, 5000);
  }

  /**
   * Load vault
   */
  loadVaultDetails() {
    if (this.prime.application_address) {
      let promises = [
        this.indexerHelper.lookupAccount(this.prime.application_address),
      ];

      Promise.all(promises).then(values => {
        let account = values[0];
        let assets = [];
        if (account['assets']) {
          for (let i = 0; i < account['assets'].length; i++) {
            assets.push({
              id: account['assets'][i]['asset-id'],
              amount: account['assets'][i]['amount']
            });
          }
        };

        this.vaultedAssets = assets.filter(a => ![this.prime.platform_asset_id, this.prime.legacy_asset_id, this.prime.prime_asset_id].includes(a.id));
      });
    }
  }

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {
      this.isConnected = this.app.account ? true : false;
      this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;
      this.isListedOwner = (this.prime.is_listed && this.prime.seller == this.app.account) ? true : false;
      this.depositableAssets = this.app.assets.filter(a => a.amount > 0 && ![this.prime.platform_asset_id, this.prime.legacy_asset_id, this.prime.prime_asset_id].includes(a.id));
    }
  }

  /**
   * Select asset to deposit
   *
   * @param asset
   */
  selectAsset(asset: any) {
    this.selectedAssetId = asset.id;
    this.selectedAssetName = this.assetHelper.get(asset.id).unit;
    this.selectedAssetDecimals = this.assetHelper.get(asset.id).decimals;
    this.hideDropdown('.select-asset-dropdown');
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
   * Withdraw rewards
   *
   * @param asset
   */
  withdrawPrime(asset: number) {
    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let optoutContract: any = null;
    let optoutContractId = 0;

    if (this.prime.gen == 1) {
      optoutContract = new baseClient.ABIContract(GenOnePrimeOptoutContract);
      optoutContractId = environment.gen1.contracts.prime.optout.application_id;
    } else {
      optoutContract = new baseClient.ABIContract(GenTwoPrimeOptoutContract);
      optoutContractId = environment.gen2.contracts.prime.optout.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.app.assets.find(a => a.id == asset)) {
        composer.addTransaction({
          txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.app.account,
            assetIndex: asset,
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
        appID: optoutContractId,
        method: this.chainHelper.getMethod(optoutContract, 'optout'),
        methodArgs: [
          asset,
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

      this.actions.withdrawPrime = asset;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.withdrawPrime = 0;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Asset withdrawn successfully');
        }
      });
    });
  }

  /**
   * Deposit rewards
   */
  depositPrime() {
    if (!this.selectedAssetId) {
      this.appHelper.showError('Please select a asset to deposit');
      return;
    }

    if (!this.inputs.amount) {
      this.appHelper.showError('Please enter the amount to deposit');
      return;
    }

    if (Number.isNaN(this.inputs.amount)) {
      this.appHelper.showError('Please enter the amount to deposit');
      return;
    }

    let max = 0;
    if (this.app.assets.find(a => a.id == this.selectedAssetId)) {
      max = this.app.assets.find(a => a.id == this.selectedAssetId).amount;
    }
    if (this.inputs.amount * Math.pow(10, this.selectedAssetDecimals) > max) {
      this.appHelper.showError('You do not have enough asset balance to deposit');
      return;
    }

    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let optinContract: any = null;
    let optinContractId = 0;

    if (this.prime.gen == 1) {
      optinContract = new baseClient.ABIContract(GenOnePrimeOptinContract);
      optinContractId = environment.gen1.contracts.prime.optin.application_id;
    } else {
      optinContract = new baseClient.ABIContract(GenTwoPrimeOptinContract);
      optinContractId = environment.gen2.contracts.prime.optin.application_id;
    }

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      if (!this.vaultedAssets.find(a => a.id == this.selectedAssetId)) {
        if (this.prime.gen == 1) {
          composer.addTransaction({
            txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
              from: this.app.account,
              to: this.prime.application_address,
              amount: environment.gen1.optin_price,
              suggestedParams: {
                ...params,
                fee: 1000,
                flatFee: true
              }
            })
          });
        } else {
          composer.addTransaction({
            txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
              from: this.app.account,
              to: this.prime.application_address,
              amount: environment.gen2.optin_price,
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
          appID: optinContractId,
          method: this.chainHelper.getMethod(optinContract, 'optin'),
          methodArgs: [
            this.selectedAssetId,
            this.prime.application_id,
          ],
          appForeignAssets: [
            this.prime.platform_asset_id
          ],
          suggestedParams: {
            ...params,
            fee: 3000,
            flatFee: true
          }
        });
      }

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.application_address,
          assetIndex: this.selectedAssetId,
          amount: Number(this.inputs.amount) * Math.pow(10, this.selectedAssetDecimals),
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

      this.actions.depositPrime = true;
      this.chainHelper.submitTransactions(transactions).then((response) => {
        this.actions.depositPrime = false;
        if (response.success) {
          this.dataHelper.loadPrimeDetails();
          this.appHelper.loadAccountDetails();
          this.appHelper.showSuccess('Asset deposited successfully');
          this.selectedAssetId = 0;
          this.selectedAssetName = 'Select Asset';
          this.selectedAssetDecimals = 0;
          this.inputs.amount = null;
        }
      });
    });
  };
}
