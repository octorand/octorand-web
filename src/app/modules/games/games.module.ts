import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LibModule } from '@lib';
import { GamesContainer } from './games.container';
import * as Pages from '@app/modules/games/pages';

const routes: Routes = [
  {
    path: '',
    component: GamesContainer,
    children: [
      {
        path: 'questora',
        component: Pages.GamesQuestoraPage
      },
    ]
  }
];

@NgModule({
  declarations: [
    GamesContainer,
    Pages.GamesQuestoraPage,
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
export class GamesModule { }
