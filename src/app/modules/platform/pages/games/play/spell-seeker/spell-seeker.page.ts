import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AppHelper } from '@lib/helpers';
import { AppModel, GameSpellSeekerModel } from '@lib/models';
import { GameService } from '@lib/services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-platform-games-play-spell-seeker',
  templateUrl: './spell-seeker.page.html',
  styleUrls: ['./spell-seeker.page.scss'],
})
export class PlatformGamesPlaySpellSeekerPage implements OnInit, OnDestroy {

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
   * Refresh account details
   *
   * @param page
   */
  updateAccount() {
    this.accountUpdated.emit();
  }
}
