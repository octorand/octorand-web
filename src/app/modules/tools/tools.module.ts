import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LibModule } from '@lib';
import { ToolsContainer } from './tools.container';
import * as Pages from '@app/modules/tools/pages';

const routes: Routes = [
  {
    path: '',
    component: ToolsContainer,
    children: [
      {
        path: 'designer',
        component: Pages.ToolsDesignerPage
      },
      {
        path: 'launchpad',
        component: Pages.ToolsLaunchpadPage
      },
      {
        path: 'launchpad/:id/account',
        component: Pages.ToolsLaunchpadAccountPage
      },
      {
        path: 'launchpad/:id/browse',
        component: Pages.ToolsLaunchpadBrowsePage
      },
      {
        path: 'launchpad/:id/market',
        component: Pages.ToolsLaunchpadMarketPage
      },
      {
        path: 'launchpad/:id/statistics',
        component: Pages.ToolsLaunchpadStatisticsPage
      },
      {
        path: 'launchpad/:id/token',
        component: Pages.ToolsLaunchpadTokenPage
      },
      {
        path: 'launchpad/:id/traits',
        component: Pages.ToolsLaunchpadTraitsPage
      },
    ]
  }
];

@NgModule({
  declarations: [
    ToolsContainer,
    Pages.ToolsDesignerPage,
    Pages.ToolsLaunchpadPage,
    Pages.ToolsLaunchpadAccountPage,
    Pages.ToolsLaunchpadBrowsePage,
    Pages.ToolsLaunchpadMarketPage,
    Pages.ToolsLaunchpadStatisticsPage,
    Pages.ToolsLaunchpadTokenPage,
    Pages.ToolsLaunchpadTraitsPage,
  ],
  imports: [
    CommonModule,
    FormsModule,
    LibModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
  bootstrap: []
})
export class ToolsModule { }
