import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppHelper } from '@lib/helpers';
import { AppModel, GameSpellSeekerModel, PlayerModel } from '@lib/models';
import { GameService } from '@lib/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-play-alpha-roller',
  templateUrl: './alpha-roller.page.html',
  styleUrls: ['./alpha-roller.page.scss'],
})
export class PlatformGamesPlayAlphaRollerPage implements OnInit, OnDestroy {

  /**
   * Selected player
   */
  @Input() player: PlayerModel = new PlayerModel();

  /**
   * Fired when account details changed
   */
  @Output() accountUpdated = new EventEmitter<any>();

  /**
   * App state
   */
  app: AppModel = new AppModel();

  /**
   * App subscription
   */
  appSubscription: Subscription = new Subscription();

  /**
   * Game instance
   */
  game: GameSpellSeekerModel = new GameSpellSeekerModel();

  /**
   * Whether the page is ready to be rendered
   */
  ready: boolean = false;

  /**
   * Game identifier
   */
  gameId = 'spell-seeker';

  /**
   * Construct component
   *
   * @param appHelper
   * @param gameService
   */
  constructor(
    private appHelper: AppHelper,
    private gameService: GameService
  ) { }

  /**
   * Initialize component
   */
  ngOnInit() {
    this.initApp();
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
  async refreshView() {
    // Read and update game status
    let game = await this.gameService.load(this.gameId);
    this.game.update(game);

    this.ready = true;
  }

  /**
   * Check letter
   *
   * @param input
   */
  async checkLetter(input: any) {
    if (input.allowed) {
      let game = await this.gameService.process(this.gameId, 'check', { letter: input.letter });
      this.game.update(game);
      this.updateAccount();
    }
  }

  /**
   * Apply boost
   *
   * @param boost
   * @param status
   */
  async applyBoost(boost: number, status: boolean) {
    if (!status) {
      let game = await this.gameService.process(this.gameId, 'boost', { boost: boost });
      this.game.update(game);
      this.appHelper.showSuccess('Boost applied successfully');
    }
  }

  /**
   * End game round
   */
  async endGame() {
    if (this.game.completed) {
      await this.gameService.process(this.gameId, 'end', {});
      this.updateAccount();
      this.refreshView();
      this.appHelper.showSuccess('Stars collected successfully');
    }
  }

  /**
   * Refresh account details
   *
   * @param page
   */
  updateAccount() {
    this.accountUpdated.emit();
  }
}
