import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LibModule } from '@lib';
import { PlayContainer } from './play.container';
import * as Pages from '@app/play/pages';

const routes: Routes = [
  {
    path: '',
    component: PlayContainer,
    children: [
      {
        path: '',
        component: Pages.PlayHomePage
      },
      {
        path: 'games',
        component: Pages.PlayGamesPage
      },
      {
        path: 'games/lottery/algo',
        component: Pages.PlayGamesLotteryAlgoPage
      },
      {
        path: 'games/lottery/algo/create',
        component: Pages.PlayGamesLotteryAlgoCreatePage
      },
      {
        path: 'games/lottery/algo/:id',
        component: Pages.PlayGamesLotteryAlgoPlayPage
      },
      {
        path: 'games/prediction/algo',
        component: Pages.PlayGamesPredictionAlgoPage
      },
      {
        path: 'games/prediction/algo/create',
        component: Pages.PlayGamesPredictionAlgoCreatePage
      },
      {
        path: 'games/prediction/algo/:id',
        component: Pages.PlayGamesPredictionAlgoPlayPage
      }
    ]
  }
];

@NgModule({
  declarations: [
    PlayContainer,
    Pages.PlayHomePage,
    Pages.PlayGamesPage,
    Pages.PlayGamesLotteryAlgoPage,
    Pages.PlayGamesLotteryAlgoCreatePage,
    Pages.PlayGamesLotteryAlgoPlayPage,
    Pages.PlayGamesPredictionAlgoPage,
    Pages.PlayGamesPredictionAlgoCreatePage,
    Pages.PlayGamesPredictionAlgoPlayPage,
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
export class PlayModule { }
