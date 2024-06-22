import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AppHelper, AssetHelper, ChainHelper, DataHelper, IndexerHelper } from '@lib/helpers';
import { GenOnePrimeAppContract, GenOnePrimeMintContract, GenOnePrimeOptinContract, GenTwoPrimeAppContract, GenTwoPrimeMintContract, GenTwoPrimeOptinContract } from '@lib/contracts';
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

  /**
   * Refresh view state
   */
  refreshView() {
    if (this.prime) {
      this.isConnected = this.app.account ? true : false;
      this.isPrimeOwner = this.app.assets.find(a => a.id == this.prime.prime_asset_id && a.amount > 0) ? true : false;
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
    this.selectedAssetName = this.assetHelper.get(asset.id).name;
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

      composer.addTransaction({
        txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
          from: this.app.account,
          to: this.prime.application_address,
          amount: 100000,
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        })
      });

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
          this.appHelper.showSuccess('Asset deposited successfully');
        }
      });
    });
  };
}
