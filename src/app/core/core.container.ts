import { Component } from '@angular/core';
import { AppHelper, ProjectHelper } from '@lib/helpers';
import { PlatformTokenomicsService, PlatformTreasuryService } from '@app/core/services';

@Component({
  selector: 'app-core-container',
  templateUrl: './core.container.html',
  styleUrls: ['./core.container.scss'],
})
export class CoreContainer {

  /**
   * The project id
   */
  projectId: string = 'core';

  /**
   * Construct component
   *
   * @param appHelper
   * @param projectHelper
   * @param platformTreasuryService
   * @param platformTokenomicsService
   */
  constructor(
    private appHelper: AppHelper,
    private projectHelper: ProjectHelper,
    private platformTreasuryService: PlatformTreasuryService,
    private platformTokenomicsService: PlatformTokenomicsService
  ) {
    let sidebar = [];

    sidebar.push({
      name: 'Platform',
      route: 'platform',
      items: [
        this.platformTreasuryService.getDefinition(),
        this.platformTokenomicsService.getDefinition(),
      ]
    });

    this.appHelper.setSidebar(sidebar);

    this.appHelper.setProject(this.projectHelper.find(this.projectId));
  }
}
