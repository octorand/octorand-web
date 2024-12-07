import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameAuthContract } from '@lib/contracts';
import { AppHelper, ChainHelper, GameHelper } from '@lib/helpers';
import { AccountModel, AppModel, PlayerModel } from '@lib/models';
import { AuthService } from '@lib/services';
import { environment } from '@environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-play',
  templateUrl: './play.page.html',
  styleUrls: ['./play.page.scss'],
})
export class PlatformGamesPlayPage implements OnInit, OnDestroy {

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
   * Player information
   */
  player: PlayerModel = new PlayerModel();

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
        this.refreshPlayer();
      } else {
        this.status = 'authenticating';
      }
    } else {
      this.status = 'connecting';
    }

    this.ready = true;
  }

  /**
   * Start the game
   */
  async startGame() {
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
      this.chainHelper.submitTransactions(transactions).then(async (response) => {
        this.actions.startGame = false;
        if (response.success) {
          this.appHelper.showSuccess('Player verified successfully');
          this.verifyGame(response.id, private_key);
        }
      });
    });
  }

  /**
   * Verify game details
   *
   * @param transaction_id
   * @param private_key
   */
  async verifyGame(transaction_id: string, private_key: string) {
    this.status = 'loading';

    let verify = await this.authService.verify(transaction_id, private_key);
    if (verify.token && this.app.address) {
      let account = this.appHelper.getAccount();
      if (!account) {
        account = new AccountModel();
      }

      account.address = this.app.address;
      account.token = verify.token;
      this.appHelper.updateAccount(account);
      this.appHelper.showSuccess('Game started successfully');
    } else {
      this.appHelper.showError('Game failed to start');
    }

    this.refreshView();
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

    if (this.player.hearts > 0) {
      this.status = 'ready';
    } else {
      this.status = 'purchasing';
    }
  }

  /**
   * Open purchase hearts page
   */
  purchaseHearts() {
    this.navigateToPage('/platform/games/purchase');
  }

  /**
   * Open redeem stars page
   */
  redeemStars() {
    this.navigateToPage('/platform/games/redeem');
  }

  /**
   * Open view rankings page
   */
  viewRankings() {
    this.navigateToPage('/platform/games/rankings');
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
