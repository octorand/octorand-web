import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LibModule } from '@lib';
import { CoreContainer } from './core.container';
import * as Pages from '@app/core/pages';

const routes: Routes = [
  {
    path: '',
    component: CoreContainer,
    children: [
      {
        path: '',
        component: Pages.CoreHomePage
      },
      {
        path: 'browse',
        component: Pages.CoreBrowsePage
      },
      {
        path: 'market',
        component: Pages.CoreMarketPage
      },
      {
        path: 'account',
        component: Pages.CoreAccountPage
      },
    ]
  }
];

@NgModule({
  declarations: [
    CoreContainer,
    Pages.CoreHomePage,
    Pages.CoreBrowsePage,
    Pages.CoreMarketPage,
    Pages.CoreAccountPage,
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
export class CoreModule { }
