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
        path: 'migration',
        component: Pages.PlatformMigrationPage
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
    ]
  }
];

@NgModule({
  declarations: [
    PlatformContainer,
    Pages.PlatformGuidePage,
    Pages.PlatformMigrationPage,
    Pages.PlatformStatisticsPage,
    Pages.PlatformTokenomicsPage,
    Pages.PlatformTraitsPage,
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
