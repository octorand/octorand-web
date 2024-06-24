import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LibModule } from '@lib';
import { CollectionContainer } from './collection.container';
import * as Pages from '@app/collection/pages';

const routes: Routes = [
  {
    path: '',
    component: CollectionContainer,
    children: [
      {
        path: '',
        component: Pages.CollectionHomePage
      },
      {
        path: 'browse',
        component: Pages.CollectionBrowsePage
      },
      {
        path: 'market',
        component: Pages.CollectionMarketPage
      },
      {
        path: 'account',
        component: Pages.CollectionAccountPage
      },
      {
        path: 'prime/:gen/:id',
        component: Pages.CollectionPrimePage
      },
    ]
  }
];

@NgModule({
  declarations: [
    CollectionContainer,
    Pages.CollectionHomePage,
    Pages.CollectionBrowsePage,
    Pages.CollectionMarketPage,
    Pages.CollectionAccountPage,
    Pages.CollectionPrimePage,
    Pages.CollectionPrimeArtworkPage,
    Pages.CollectionPrimeFamilyPage,
    Pages.CollectionPrimeMarketPage,
    Pages.CollectionPrimeRewardsPage,
    Pages.CollectionPrimeSummaryPage,
    Pages.CollectionPrimeTraitsPage,
    Pages.CollectionPrimeTransformPage,
    Pages.CollectionPrimeVaultPage,
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
export class CollectionModule { }
