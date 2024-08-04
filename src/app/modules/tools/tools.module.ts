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
        path: 'launchpad/:collection_id/account',
        component: Pages.ToolsLaunchpadAccountPage
      },
      {
        path: 'launchpad/:collection_id/browse',
        component: Pages.ToolsLaunchpadBrowsePage
      },
      {
        path: 'launchpad/:collection_id/market',
        component: Pages.ToolsLaunchpadMarketPage
      },
      {
        path: 'launchpad/:collection_id/statistics',
        component: Pages.ToolsLaunchpadStatisticsPage
      },
      {
        path: 'launchpad/:collection_id/tokenomics',
        component: Pages.ToolsLaunchpadTokenomicsPage
      },
      {
        path: 'launchpad/:collection_id/traits',
        component: Pages.ToolsLaunchpadTraitsPage
      },
      {
        path: 'launchpad/:collection_id/item/:item_id',
        component: Pages.ToolsLaunchpadItemPage
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
    Pages.ToolsLaunchpadTokenomicsPage,
    Pages.ToolsLaunchpadTraitsPage,
    Pages.ToolsLaunchpadItemPage,
    Pages.ToolsLaunchpadItemMarketPage,
    Pages.ToolsLaunchpadItemRewardsPage,
    Pages.ToolsLaunchpadItemSummaryPage,
    Pages.ToolsLaunchpadItemTraitsPage,
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
