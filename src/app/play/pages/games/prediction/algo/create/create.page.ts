import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper, ChainHelper } from '@lib/helpers';
import { PredictionAlgoService } from '@app/play/services';
import { PredictionAlgoMainContract } from '@app/play/contracts';

import * as moment from 'moment';

@Component({
  selector: 'app-play-games-prediction-algo-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class PlayGamesPredictionAlgoCreatePage implements OnInit {

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
    options: 2,
    name: '',
    option1: '',
    option2: '',
    option3: '',
    timer: moment().format('YYYY-MM-DDTHH:mm'),
    platformPercentage: 4,
    managerPercentage: 6,
    winnerPercentage: 90,
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
   * @param PredictionAlgoService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private PredictionAlgoService: PredictionAlgoService
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

    this.gameDefinition = this.PredictionAlgoService.getDefinition();
  }

  /**
   * Change game options count
   *
   * @param options
   */
  changeOptions(options: number) {
    this.model.options = options;

    if (options < 3) {
      this.model.option3 = '';
    }
  }

  /**
   * Update winner percentage
   *
   * @param value
   */
  updateWinnerPercentage(value: number) {
    this.model.winnerPercentage = value;
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
    this.model.totalPercentage = this.model.platformPercentage + this.model.managerPercentage + this.model.winnerPercentage;
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
      let mainContract = new baseClient.ABIContract(PredictionAlgoMainContract);

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        let name = new Uint8Array(Buffer.from((this.model.name + ' '.repeat(32)).substring(0, 32)));
        let option1 = new Uint8Array(Buffer.from((this.model.option1 + ' '.repeat(24)).substring(0, 24)));
        let option2 = new Uint8Array(Buffer.from((this.model.option2 + ' '.repeat(24)).substring(0, 24)));
        let option3 = new Uint8Array(Buffer.from((this.model.option3 + ' '.repeat(24)).substring(0, 24)));

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDefinition.mainAppId,
          method: mainContract.methods.find((m: any) => { return m.name == 'create_game' }),
          methodArgs: [
            Number(moment(this.model.timer, 'YYYY-MM-DDTHH:mm').format('X')),
            this.model.managerPercentage,
            this.model.winnerPercentage,
            name,
            option1,
            option2,
            option3,
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
      this.appHelper.showError('Please fill name of prediction.');
    }

    if (moment(this.model.timer, 'YYYY-MM-DDTHH:mm').isBefore()) {
      valid = false;
      this.appHelper.showError('End time must be in future.');
    }

    if (this.model.totalPercentage != 100) {
      valid = false;
      this.appHelper.showError('Please make sure payout percentages add up to 100.');
    }

    if (!Number.isInteger(this.model.winnerPercentage)) {
      valid = false;
      this.appHelper.showError('Payout percentages must be in integers.');
    }

    if (!Number.isInteger(this.model.managerPercentage)) {
      valid = false;
      this.appHelper.showError('Payout percentages must be in integers.');
    }

    if (!this.model.option1) {
      valid = false;
      this.appHelper.showError('Please fill name of first option.');
    }

    if (!this.model.option2) {
      valid = false;
      this.appHelper.showError('Please fill name of second option.');
    }

    if (this.model.options > 2 && !this.model.option3) {
      valid = false;
      this.appHelper.showError('Please fill name of third option.');
    }

    return valid;
  }
}
