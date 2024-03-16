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
        path: 'platform',
        component: Pages.CorePlatformPage
      },
      {
        path: 'platform/tokenomics',
        component: Pages.CorePlatformTokenomicsPage
      },
      {
        path: 'platform/treasury',
        component: Pages.CorePlatformTreasuryPage
      }
    ]
  }
];

@NgModule({
  declarations: [
    CoreContainer,
    Pages.CoreHomePage,
    Pages.CorePlatformPage,
    Pages.CorePlatformTokenomicsPage,
    Pages.CorePlatformTreasuryPage,
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
