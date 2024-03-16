import { Component } from '@angular/core';
import { AppHelper, ProjectHelper } from '@lib/helpers';
import { LotteryAlgoService, PredictionAlgoService } from '@app/play/services';

@Component({
  selector: 'app-play-container',
  templateUrl: './play.container.html',
  styleUrls: ['./play.container.scss'],
})
export class PlayContainer {

  /**
   * The project id
   */
  projectId: string = 'play';

  /**
   * Construct component
   *
   * @param appHelper
   * @param projectHelper
   * @param LotteryAlgoService
   * @param PredictionAlgoService
   */
  constructor(
    private appHelper: AppHelper,
    private projectHelper: ProjectHelper,
    private LotteryAlgoService: LotteryAlgoService,
    private PredictionAlgoService: PredictionAlgoService
  ) {
    let sidebar = [];

    sidebar.push({
      name: 'Games',
      route: 'play/games',
      items: [
        this.LotteryAlgoService.getDefinition(),
        this.PredictionAlgoService.getDefinition()
      ]
    });

    this.appHelper.setSidebar(sidebar);

    this.appHelper.setProject(this.projectHelper.find(this.projectId));
  }
}
