import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppHelper } from '@lib/helpers';
import { LotteryAlgoService, PredictionAlgoService } from '@app/play/services';

@Component({
  selector: 'app-play-games',
  templateUrl: './games.page.html',
  styleUrls: ['./games.page.scss'],
})
export class PlayGamesPage implements OnInit {

  /**
   * App state
   */
  app: any = null;

  /**
   * Available games
   */
  games: Array<any> = [];

  /**
   * Construct component
   *
   * @param router
   * @param appHelper
   * @param LotteryAlgoService
   * @param PredictionAlgoService
   */
  constructor(
    private router: Router,
    private appHelper: AppHelper,
    private LotteryAlgoService: LotteryAlgoService,
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

    this.games = [
      this.LotteryAlgoService.getDefinition(),
      this.PredictionAlgoService.getDefinition()
    ];
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
