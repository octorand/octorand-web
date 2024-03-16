import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, AssetHelper, ChainHelper } from '@lib/helpers';
import { PredictionAlgoModel } from '@app/play/models';
import { PredictionAlgoService } from '@app/play/services';
import { PredictionAlgoGameContract } from '@app/play/contracts';

import * as moment from 'moment';

@Component({
  selector: 'app-play-games-prediction-algo-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayGamesPredictionAlgoPlayPage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: any = null;

  /**
   * Game definition
   */
  gameDefinition: any = null;

  /**
   * Game details
   */
  gameDetails: PredictionAlgoModel = new PredictionAlgoModel();

  /**
   * Track game details loading task
   */
  gameDetailsLoadTask: any = null;

  /**
   * Track game details refreshing task
   */
  gameDetailsRefreshTask: any = null;

  /**
   * The data model to manage inputs
   */
  model = {
    amount1: null,
    amount2: null,
    amount3: null,
    name: '',
    timer: moment().format('YYYY-MM-DDTHH:mm'),
    winner: 0
  };

  /**
   * Tracking actions
   */
  actions = {
    loadingGame: true,
    submittingBets1: false,
    submittingBets2: false,
    submittingBets3: false,
    withdrawingEarnings: false,
    updatingName: false,
    updatingOptions: false,
    updatingTimer: false,
    finalisingGame: false,
    withdrawingProfits: false,
  };

  /**
   * True if the data loading fails
   */
  loadingError: boolean = false;

  /**
   * True if data loading is going on
   */
  loading: boolean = true;

  /**
   * Construct component
   *
   * @param router
   * @param activatedRoute
   * @param appHelper
   * @param assetHelper
   * @param chainHelper
   * @param PredictionAlgoService
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appHelper: AppHelper,
    private assetHelper: AssetHelper,
    private chainHelper: ChainHelper,
    private PredictionAlgoService: PredictionAlgoService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initTasks();
  }

  /**
   * Destroy component
   */
  ngOnDestroy() {
    clearInterval(this.gameDetailsLoadTask);
    clearInterval(this.gameDetailsRefreshTask);
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
   * Initialize tasks
   */
  initTasks() {
    this.loadGameDetails();
    this.gameDetailsLoadTask = setInterval(() => { this.loadGameDetails() }, 5000);

    this.refreshGameDetails();
    this.gameDetailsRefreshTask = setInterval(() => { this.refreshGameDetails() }, 1000);
  }

  /**
   * Load game details
   */
  loadGameDetails() {
    this.loading = true;
    let appId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.chainHelper.lookupApplication(appId).then((application: any) => {
      this.gameDetails = this.PredictionAlgoService.create(this.gameDetails, application);
      this.gameDetails = this.PredictionAlgoService.setPayouts(this.gameDetails);

      if (this.actions.loadingGame) {
        this.model.name = this.gameDetails.storage.name;
        this.model.timer = moment.unix(this.gameDetails.storage.timer).format('YYYY-MM-DDTHH:mm');
      }

      this.actions.loadingGame = false;

      if (this.app.account) {
        this.chainHelper.lookupAccountApplicationLocalStates(appId, this.app.account).then((application: any) => {
          this.gameDetails = this.PredictionAlgoService.setAccount(this.gameDetails, application);
        });
      }

      this.chainHelper.lookupAccountTransactions(appId).then((transactions: Array<any>) => {
        this.gameDetails = this.PredictionAlgoService.setActions(this.gameDetails, transactions);
        this.gameDetails = this.PredictionAlgoService.setTickets(this.gameDetails);
        this.loading = false;
      });
    }).catch(() => {
      if (this.actions.loadingGame) {
        this.loadingError = true;
        this.actions.loadingGame = false;
      }

      this.loading = false;
    });
  }

  /**
   * Refresh game details
   */
  refreshGameDetails() {
    if (!this.actions.loadingGame) {
      this.gameDetails = this.PredictionAlgoService.refresh(this.gameDetails);
    }
  }

  /**
   * Change game winner
   *
   * @param winner
   */
  changeWinner(winner: number) {
    this.model.winner = winner;
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
   * Submit bets
   *
   * @param option
   */
  submitBets(option: number) {
    if (this.validateSubmitBets(option)) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let gameContract = new baseClient.ABIContract(PredictionAlgoGameContract);

      let asset = this.assetHelper.get(this.gameDetails.assetId);

      let amount = 0;
      if (option == 1) {
        amount = Number(this.model.amount1) * Math.pow(10, asset.decimals);
      } else if (option == 2) {
        amount = Number(this.model.amount2) * Math.pow(10, asset.decimals);
      } else if (option == 3) {
        amount = Number(this.model.amount3) * Math.pow(10, asset.decimals);
      }

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        if (!this.gameDetails.account.opted) {
          composer.addTransaction({
            txn: baseClient.makeApplicationOptInTxnFromObject({
              from: this.app.account,
              appIndex: this.gameDetails.id,
              suggestedParams: {
                ...params,
              }
            })
          });
        }

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'power' }),
          methodArgs: [],
          suggestedParams: {
            ...params,
          }
        });

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'play' }),
          methodArgs: [
            option,
            amount
          ],
          suggestedParams: {
            ...params,
          }
        });

        composer.addTransaction({
          txn: baseClient.makePaymentTxnWithSuggestedParamsFromObject({
            from: this.app.account,
            to: this.gameDetails.address,
            amount: amount,
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

        if (option == 1) {
          this.actions.submittingBets1 = true;
        } else if (option == 2) {
          this.actions.submittingBets2 = true;
        } else if (option == 3) {
          this.actions.submittingBets3 = true;
        }

        this.chainHelper.submitTransactions(transactions).then(() => {
          if (option == 1) {
            this.actions.submittingBets1 = false;
          } else if (option == 2) {
            this.actions.submittingBets2 = false;
          } else if (option == 3) {
            this.actions.submittingBets3 = false;
          }
        });
      });
    }
  }

  /**
   * Validate inputs to submit bets
   *
   * @param option
   */
  validateSubmitBets(option: number) {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    if (option == 1 && !this.model.amount1) {
      valid = false;
      this.appHelper.showError('Please fill amount to pay for betting.');
    }

    if (option == 2 && !this.model.amount2) {
      valid = false;
      this.appHelper.showError('Please fill amount to pay for betting.');
    }

    if (option == 3 && !this.model.amount3) {
      valid = false;
      this.appHelper.showError('Please fill amount to pay for betting.');
    }

    if (!this.assetHelper.get(this.gameDetails.assetId)) {
      valid = false;
      this.appHelper.showError('Asset not found, please try again.');
    }

    return valid;
  }

  /**
   * Withdraw earnings
   */
  withdrawEarnings() {
    if (this.validateWithdrawEarnings()) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let gameContract = new baseClient.ABIContract(PredictionAlgoGameContract);

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'withdraw' }),
          methodArgs: [],
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

        this.actions.withdrawingEarnings = true;
        this.chainHelper.submitTransactions(transactions).then(() => {
          this.actions.withdrawingEarnings = false;
        });
      });
    }
  }

  /**
   * Validate inputs to withdraw earnings
   */
  validateWithdrawEarnings() {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    return valid;
  }

  /**
   * Update name
   */
  updateName() {
    if (this.validateUpdateName()) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let gameContract = new baseClient.ABIContract(PredictionAlgoGameContract);

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        let name = new Uint8Array(Buffer.from((this.model.name + ' '.repeat(32)).substring(0, 32)));

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'update_name' }),
          methodArgs: [
            name
          ],
          suggestedParams: {
            ...params,
          }
        });

        let group = composer.buildGroup();

        let transactions = [];
        for (let i = 0; i < group.length; i++) {
          transactions.push(group[i].txn);
        }

        this.actions.updatingName = true;
        this.chainHelper.submitTransactions(transactions).then(() => {
          this.actions.updatingName = false;
        });
      });
    }
  }

  /**
   * Validate inputs to update name
   */
  validateUpdateName() {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    if (!this.model.name) {
      valid = false;
      this.appHelper.showError('Please fill name of lottery.');
    }

    return valid;
  }

  /**
   * Update timer
   */
  updateTimer() {
    if (this.validateUpdateTimer()) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let gameContract = new baseClient.ABIContract(PredictionAlgoGameContract);

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'update_timer' }),
          methodArgs: [
            Number(moment(this.model.timer, 'YYYY-MM-DDTHH:mm').format('X')),
          ],
          suggestedParams: {
            ...params,
          }
        });

        let group = composer.buildGroup();

        let transactions = [];
        for (let i = 0; i < group.length; i++) {
          transactions.push(group[i].txn);
        }

        this.actions.updatingTimer = true;
        this.chainHelper.submitTransactions(transactions).then(() => {
          this.actions.updatingTimer = false;
        });
      });
    }
  }

  /**
   * Validate inputs to update timer
   */
  validateUpdateTimer() {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    if (moment(this.model.timer, 'YYYY-MM-DDTHH:mm').isBefore()) {
      valid = false;
      this.appHelper.showError('End time must be in future.');
    }

    return valid;
  }

  /**
   * Finalise game
   */
  finaliseGame() {
    if (this.validateFinaliseGame()) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let gameContract = new baseClient.ABIContract(PredictionAlgoGameContract);

      let winner = this.model.winner;

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'finish' }),
          methodArgs: [
            winner
          ],
          suggestedParams: {
            ...params,
            fee: 4000,
            flatFee: true
          }
        });

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'share' }),
          methodArgs: [
            this.gameDetails.storage.master,
            this.gameDetails.storage.manager
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

        this.actions.finalisingGame = true;
        this.chainHelper.submitTransactions(transactions).then(() => {
          this.actions.finalisingGame = false;
        });
      });
    }
  }

  /**
   * Validate inputs to finalise game
   */
  validateFinaliseGame() {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    if (this.model.winner < 1 || this.model.winner > 3) {
      valid = false;
      this.appHelper.showError('Please select winning option.');
    }

    return valid;
  }
}
