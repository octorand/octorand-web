import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { AppHelper, ChainHelper, DataHelper } from '@lib/helpers';
import { GenOnePrimeClaimContract, GenTwoPrimeClaimContract } from '@lib/contracts';
import { AppModel, DataModel, PrimeModel } from '@lib/models';
import { environment } from '@environment';

@Component({
  selector: 'app-collection-prime-ownership',
  templateUrl: './ownership.page.html',
  styleUrls: ['./ownership.page.scss'],
})
export class CollectionPrimeOwnershipPage implements OnInit, OnChanges {

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
   * Whether prime is claimable
   */
  isClaimable: boolean = false;

  /**
   * Tracking actions
   */
  actions = {
    claimPrime: false,
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
      this.isClaimable = (this.isPrimeOwner && this.prime.owner != this.app.account) ? true : false;
    }
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
}
