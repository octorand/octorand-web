import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHelper, AssetHelper, ChainHelper } from '@lib/helpers';
import { LotteryAlgoModel } from '@app/play/models';
import { LotteryAlgoService } from '@app/play/services';
import { LotteryAlgoGameContract } from '@app/play/contracts';

import * as moment from 'moment';

@Component({
  selector: 'app-play-games-lottery-algo-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlayGamesLotteryAlgoPlayPage implements OnInit, OnDestroy {

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
  gameDetails: LotteryAlgoModel = new LotteryAlgoModel();

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
    amount: null,
    name: '',
    timer: moment().format('YYYY-MM-DDTHH:mm'),
  };

  /**
   * Tracking actions
   */
  actions = {
    loadingGame: true,
    buyingTickets: false,
    withdrawingEarnings: false,
    updatingName: false,
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
   * @param LotteryAlgoService
   */
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private appHelper: AppHelper,
    private assetHelper: AssetHelper,
    private chainHelper: ChainHelper,
    private LotteryAlgoService: LotteryAlgoService
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

    this.gameDefinition = this.LotteryAlgoService.getDefinition();
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
      this.gameDetails = this.LotteryAlgoService.create(this.gameDetails, application);
      this.gameDetails = this.LotteryAlgoService.setPayouts(this.gameDetails);

      if (this.actions.loadingGame) {
        this.model.name = this.gameDetails.storage.name;
        this.model.timer = moment.unix(this.gameDetails.storage.timer).format('YYYY-MM-DDTHH:mm');
      }

      this.actions.loadingGame = false;

      if (this.app.account) {
        this.chainHelper.lookupAccountApplicationLocalStates(appId, this.app.account).then((application: any) => {
          this.gameDetails = this.LotteryAlgoService.setAccount(this.gameDetails, application);
        });
      }

      this.chainHelper.lookupAccountTransactions(appId).then((transactions: Array<any>) => {
        this.gameDetails = this.LotteryAlgoService.setActions(this.gameDetails, transactions);
        this.gameDetails = this.LotteryAlgoService.setTickets(this.gameDetails);
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
      this.gameDetails = this.LotteryAlgoService.refresh(this.gameDetails);
    }
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
   * Buy tickets
   */
  buyTickets() {
    if (this.validateBuyTickets()) {
      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();
      let gameContract = new baseClient.ABIContract(LotteryAlgoGameContract);

      let asset = this.assetHelper.get(this.gameDetails.assetId);
      let amount = Number(this.model.amount) * Math.pow(10, asset.decimals);

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
          method: gameContract.methods.find((m: any) => { return m.name == 'play' }),
          methodArgs: [
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

        this.actions.buyingTickets = true;
        this.chainHelper.submitTransactions(transactions).then(() => {
          this.actions.buyingTickets = false;
        });
      });
    }
  }

  /**
   * Validate inputs to buy tickets
   */
  validateBuyTickets() {
    let valid = true;

    if (!this.app.account) {
      valid = false;
      this.appHelper.showError('Please connect your wallet first.');
    }

    if (!this.model.amount) {
      valid = false;
      this.appHelper.showError('Please fill amount to pay.');
    }

    if (!this.assetHelper.get(this.gameDetails.assetId)) {
      valid = false;
      this.appHelper.showError('Asset not found, please try again.');
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
      let gameContract = new baseClient.ABIContract(LotteryAlgoGameContract);

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
      let gameContract = new baseClient.ABIContract(LotteryAlgoGameContract);

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
      let gameContract = new baseClient.ABIContract(LotteryAlgoGameContract);

      let winner1 = this.selectWinner(this.gameDetails.storage.winnerPercentage1);
      let winner2 = this.selectWinner(this.gameDetails.storage.winnerPercentage2);
      let winner3 = this.selectWinner(this.gameDetails.storage.winnerPercentage3);

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        composer.addMethodCall({
          sender: this.app.account,
          appID: this.gameDetails.id,
          method: gameContract.methods.find((m: any) => { return m.name == 'finish' }),
          methodArgs: [
            winner1,
            winner2,
            winner3
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

    if (this.gameDetails.tickets.length == 0) {
      valid = false;
      this.appHelper.showError('Please try again.');
    }

    return valid;
  }

  /**
   * Select a winner for the game
   *
   * @param percentage
   */
  selectWinner(percentage: number) {
    let winner = this.gameDetails.storage.manager;
    if (percentage > 0) {
      let random = Math.random() * 100;
      let start = 0;

      for (let i = 0; i < this.gameDetails.tickets.length; i++) {
        let ticket = this.gameDetails.tickets[i];
        let end = start + ticket.percentage;
        if (random < end) {
          winner = ticket.address;
          break;
        } else {
          start = end;
        }
      }
    }

    return winner;
  }
}
