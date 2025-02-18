import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { AppModel, PlayerModel } from '@lib/models';
import { AuthService, DepositService } from '@lib/services';
import { GameDepositContract } from '@lib/contracts';
import { Subscription } from 'rxjs';
import { environment } from '@environment';

@Component({
  selector: 'app-platform-games-purchase',
  templateUrl: './purchase.page.html',
  styleUrls: ['./purchase.page.scss'],
})
export class PlatformGamesPurchasePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Player information
   */
  player: PlayerModel = new PlayerModel();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Manage inputs
   */
  inputs = {
    hearts: 10,
  };

  /**
   * Tracking actions
   */
  actions = {
    purchaseHearts: false,
  };

  /**
   * Platform asset id
   */
  assetId: number = 0;

  /**
   * Platform asset balance
   */
  assetBalance: number = 0;

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param authService
   * @param depositService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private authService: AuthService,
    private depositService: DepositService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.refreshBalances();
    this.refreshView();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appSubscription = this.appHelper.app.subscribe((value: AppModel) => {
      this.app = value;
      this.refreshView();
    });
  }

  /**
   * Refresh view state
   */
  refreshView() {
    this.assetId = environment.platform.asset_id;

    let platformAsset = this.app.assets.find(a => a.id == this.assetId);
    if (platformAsset) {
      this.assetBalance = platformAsset.amount;
    } else {
      this.assetBalance = 0;
    }

    let account = this.appHelper.getAccount();
    if (account) {
      if (account.token) {
        this.refreshPlayer();
      } else {
        this.backToGames();
      }
    } else {
      this.backToGames();
    }

    this.ready = true;
  }

  /**
   * Refresh player status
   */
  async refreshPlayer() {
    let account = await this.authService.account();
    if (account) {
      this.player.id = account.id;
      this.player.address = account.address;
      this.player.hearts = account.hearts;
      this.player.stars = account.stars;
      this.player.ranking = account.ranking;
    }
  }

  /**
   * Purchase hearts
   */
  purchaseHearts() {
    if (!this.inputs.hearts) {
      this.appHelper.showError('Please enter the hearts to purchase');
      return;
    }

    if (Number.isNaN(this.inputs.hearts)) {
      this.appHelper.showError('Please enter the hearts to purchase');
      return;
    }

    if (this.inputs.hearts < 1) {
      this.appHelper.showError('Hearts to purchase must be greater than 1');
      return;
    }

    if (this.inputs.hearts > 100) {
      this.appHelper.showError('Hearts to purchase must be less than 100');
      return;
    }

    if (!Number.isInteger(this.inputs.hearts)) {
      this.appHelper.showError('Hearts to purchase must not be a decimal number');
      return;
    }

    if (this.inputs.hearts * Math.pow(10, 6) > this.assetBalance) {
      this.appHelper.showError('You do not have enough OCTO to make this purchase');
      return;
    }

    let baseClient = this.chainHelper.getBaseClient();
    let algodClient = this.chainHelper.getAlgodClient();

    let depositContract: any = new baseClient.ABIContract(GameDepositContract);
    let depositContractId = environment.game.contracts.deposit.application_id;

    algodClient.getTransactionParams().do().then((params: any) => {
      let composer = new baseClient.AtomicTransactionComposer();

      composer.addMethodCall({
        sender: this.app.address,
        appID: depositContractId,
        method: this.chainHelper.getMethod(depositContract, 'deposit'),
        methodArgs: [
          this.inputs.hearts * Math.pow(10, 6),
        ],
        suggestedParams: {
          ...params,
          fee: 1000,
          flatFee: true
        }
      });

      composer.addTransaction({
        txn: baseClient.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: this.app.address,
          to: environment.platform.reserve,
          assetIndex: this.assetId,
          amount: this.inputs.hearts * Math.pow(10, 6),
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

      this.actions.purchaseHearts = true;
      this.chainHelper.submitTransactions(transactions).then(async (response) => {
        this.actions.purchaseHearts = false;
        if (response.success) {
          await this.refreshBalances();
          this.appHelper.showSuccess('Purchased hearts successfully');
        }
      });
    });
  }

  /**
   * Update player balances
   */
  async refreshBalances() {
    let account = this.appHelper.getAccount();
    if (account) {
      if (account.token) {
        await this.depositService.sync();
        await this.refreshPlayer();
      }
    }
  }

  /**
   * Open games page
   */
  backToGames() {
    this.navigateToPage('/platform/games');
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }
}
