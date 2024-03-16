import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { LotteryAlgoService } from '@app/play/services';
import { LotteryAlgoMainContract } from '@app/play/contracts';

import * as moment from 'moment';

@Component({
  selector: 'app-play-games-lottery-algo-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class PlayGamesLotteryAlgoCreatePage implements OnInit {

  /**
   * App state
   */
  app: any = null;

  /**
   * Game definition
   */
  gameDefinition: any = null;

  /**
   * The data model to manage inputs
   */
  model = {
    winners: 1,
    name: '',
    timer: moment().format('YYYY-MM-DDTHH:mm'),
    platformPercentage: 4,
    managerPercentage: 6,
    winnerPercentage1: 90,
    winnerPercentage2: 0,
    winnerPercentage3: 0,
    totalPercentage: 100
  };

  /**
   * Tracking actions
   */
  actions = {
    creatingGame: false
  };

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param LotteryAlgoService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private LotteryAlgoService: LotteryAlgoService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
  }

  /**
   * Initialize app
   */
  initApp() {
    this.app = this.appHelper.getDefaultState();
    this.appHelper.app.subscribe((value: any) => {
      this.app = value;
    });

    this.gameDefinition = this.LotteryAlgoService.getDefinition();
  }

  /**
   * Change game winners count
   *
   * @param winners
   */
  changeWinners(winners: number) {
    this.model.winners = winners;

    switch (winners) {
      case 1:
        this.model.winnerPercentage1 = 90;
        this.model.winnerPercentage2 = 0;
        this.model.winnerPercentage3 = 0;
        break;
      case 2:
        this.model.winnerPercentage1 = 60;
        this.model.winnerPercentage2 = 30;
        this.model.winnerPercentage3 = 0;
        break;
      case 3:
        this.model.winnerPercentage1 = 40;
        this.model.winnerPercentage2 = 30;
        this.model.winnerPercentage3 = 20;
        break;
    }

    this.calculateTotalPercentage();
  }

  /**
   * Update winner percentages
   *
   * @param winner
   * @para value
   */
  updateWinnerPercentage(winner: number, value: number) {
    switch (winner) {
      case 1:
        this.model.winnerPercentage1 = value;
        break;
      case 2:
        this.model.winnerPercentage2 = value;
        break;
      case 3:
        this.model.winnerPercentage3 = value;
        break;
    }
    this.calculateTotalPercentage();
  }

  /**
   * Update manager percentage
   */
  updateManagerPercentage(value: number) {
    this.model.managerPercentage = value;
    this.calculateTotalPercentage();
  }

  /**
   * Calculate total percentage
   */
  calculateTotalPercentage() {
    this.model.totalPercentage = this.model.platformPercentage + this.model.managerPercentage +
      this.model.winnerPercentage1 + this.model.winnerPercentage2 + this.model.winnerPercentage3;
  }

  /**
   * Navigate to page
   *
   * @param page
   */
  navigateToPage(page: string) {
    this.router.navigate([page]);
  }

  /**
   * Create game
   */
  createGame() {
    if (this.validateCreateGame()) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let mainContract = new baseClient.ABIContract(LotteryAlgoMainContract);

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        let name = new Uint8Array(Buffer.from((this.model.name + ' '.repeat(32)).substring(0, 32)));

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDefinition.mainAppId,
          method: mainContract.methods.find((m: any) => { return m.name == 'create_game' }),
          methodArgs: [
            Number(moment(this.model.timer, 'YYYY-MM-DDTHH:mm').format('X')),
            this.model.managerPercentage,
            this.model.winnerPercentage1,
            this.model.winnerPercentage2,
            this.model.winnerPercentage3,
            name,
          ],
          suggestedParams: {
            ...params,
          }
        });

        composer.addTransaction({
          txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.gameDefinition.mainAppAddress,
            amount: this.gameDefinition.creationCost,
            suggestedParams: {
              ...params,
            }
          })
        });

        let group = composer.buildGroup();

        let transactions = [];
        for (let i = 0; i < group.length; i++) {
          transactions.push(group[i].txn);
        }

        this.actions.creatingGame = true;
        this.chainHelper.submitTransactions(transactions).then((response) => {
          this.actions.creatingGame = false;
          if (response.success) {
            let appId = response.result['inner-txns'][0]['application-index'];
            this.navigateToPage(this.gameDefinition.route + '/' + appId);
          }
        });
      });
    }
  }

  /**
   * Validate inputs to create a game
   */
  validateCreateGame() {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    if (!this.model.name) {
      valid = false;
      this.appHelper.showError('Please fill name of lottery.');
    }

    if (moment(this.model.timer, 'YYYY-MM-DDTHH:mm').isBefore()) {
      valid = false;
      this.appHelper.showError('End time must be in future.');
    }

    if (this.model.totalPercentage != 100) {
      valid = false;
      this.appHelper.showError('Please make sure payout percentages add up to 100.');
    }

    if (!Number.isInteger(this.model.winnerPercentage1)) {
      valid = false;
      this.appHelper.showError('Payout percentages must be in integers.');
    }

    if (!Number.isInteger(this.model.winnerPercentage2)) {
      valid = false;
      this.appHelper.showError('Payout percentages must be in integers.');
    }

    if (!Number.isInteger(this.model.winnerPercentage3)) {
      valid = false;
      this.appHelper.showError('Payout percentages must be in integers.');
    }

    if (!Number.isInteger(this.model.managerPercentage)) {
      valid = false;
      this.appHelper.showError('Payout percentages must be in integers.');
    }

    return valid;
  }
}
