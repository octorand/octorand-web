import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameAuthContract } from '@lib/contracts';
import { AppHelper, ChainHelper, GameHelper } from '@lib/helpers';
import { AccountModel, AppModel } from '@lib/models';
import { AuthService } from '@lib/services';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-core',
  templateUrl: './core.page.html',
  styleUrls: ['./core.page.scss'],
})
export class PlatformGamesCorePage implements OnInit, OnDestroy {

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Game information
   */
  game: any = {};

  /**
   * Game status
   */
  status: string = 'loading';

  /**
   * Tracking actions
   */
  actions = {
    startGame: false,
  };

  /**
   * Construct component
   *
   * @param activatedRoute
   * @param router
   * @param appHelper
   * @param chainHelper
   * @param gameHelper
   * @param authService
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private appHelper: AppHelper,
    private chainHelper: ChainHelper,
    private gameHelper: GameHelper,
    private authService: AuthService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
    this.initGame();
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
   * Initialize game
   */
  initGame() {
    let game = this.activatedRoute.snapshot.params['game_id'];
    this.game = this.gameHelper.find(game);
  }

  /**
   * Refresh view state
   */
  refreshView() {
    let account = this.appHelper.getAccount();
    if (account) {
      if (account.token) {
        this.status = 'ready';
      } else {
        this.status = 'auth-required';
      }
    } else {
      this.status = 'connect-required';
    }

    this.ready = true;
  }

  /**
   * Start the game
   */
  async startGame() {
    let account = this.appHelper.getAccount();
    if (!account && this.app.address) {
      account = new AccountModel();
      account.address = this.app.address;
    }

    if (account) {
      let setup = await this.authService.setup();
      let private_key = setup.private_key;
      let public_key = setup.public_key;

      let baseClient = this.chainHelper.getBaseClient();
      let algodClient = this.chainHelper.getAlgodClient();

      let authContract: any = new baseClient.ABIContract(GameAuthContract);
      let authContractId = environment.game.contracts.auth.application_id;

      algodClient.getTransactionParams().do().then((params: any) => {
        let composer = new baseClient.AtomicTransactionComposer();

        composer.addMethodCall({
          sender: this.app.address,
          appID: authContractId,
          method: this.chainHelper.getMethod(authContract, 'auth'),
          methodArgs: [
            this.chainHelper.getBytes(public_key),
          ],
          suggestedParams: {
            ...params,
            fee: 1000,
            flatFee: true
          }
        });

        let group = composer.buildGroup();

        let transactions = [];
        for (let i = 0; i < group.length; i++) {
          transactions.push(group[i].txn);
        }

        this.actions.startGame = true;
        this.chainHelper.submitTransactions(transactions).then((response) => {
          this.actions.startGame = false;
          if (response.success) {
            console.log(response);
            this.appHelper.showSuccess('Game started successfully');
          }
        });
      });
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
}
