import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LibModule } from '@lib';
import { PlatformContainer } from './platform.container';
import * as Pages from '@app/modules/platform/pages';

const routes: Routes = [
  {
    path: '',
    component: PlatformContainer,
    children: [
      {
        path: 'guide',
        component: Pages.PlatformGuidePage
      },
      {
        path: 'history',
        component: Pages.PlatformHistoryPage
      },
      {
        path: 'leaderboard',
        component: Pages.PlatformLeaderboardPage
      },
      {
        path: 'statistics',
        component: Pages.PlatformStatisticsPage
      },
      {
        path: 'tokenomics',
        component: Pages.PlatformTokenomicsPage
      },
      {
        path: 'traits',
        component: Pages.PlatformTraitsPage
      },
      {
        path: 'upgrade',
        component: Pages.PlatformUpgradePage
      },
      {
        path: 'games',
        component: Pages.PlatformGamesPage
      },
      {
        path: 'games/purchase/:game_id',
        component: Pages.PlatformGamesPurchasePage
      },
      {
        path: 'games/rankings/:game_id',
        component: Pages.PlatformGamesRankingsPage
      },
      {
        path: 'games/play/:game_id',
        component: Pages.PlatformGamesPlayPage
      },
    ]
  }
];

@NgModule({
  declarations: [
    PlatformContainer,
    Pages.PlatformGuidePage,
    Pages.PlatformHistoryPage,
    Pages.PlatformLeaderboardPage,
    Pages.PlatformStatisticsPage,
    Pages.PlatformTokenomicsPage,
    Pages.PlatformTraitsPage,
    Pages.PlatformUpgradePage,
    Pages.PlatformGamesPage,
    Pages.PlatformGamesPurchasePage,
    Pages.PlatformGamesRankingsPage,
    Pages.PlatformGamesPlayPage,
    Pages.PlatformGamesPlaySpellSeekerPage,
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
export class PlatformModule { }
