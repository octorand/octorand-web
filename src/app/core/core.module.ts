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
        path: 'browse/gen1',
        component: Pages.CoreBrowseOnePage
      },
      {
        path: 'browse/gen2',
        component: Pages.CoreBrowseTwoPage
      }
    ]
  }
];

@NgModule({
  declarations: [
    CoreContainer,
    Pages.CoreHomePage,
    Pages.CoreBrowsePage,
    Pages.CoreBrowseOnePage,
    Pages.CoreBrowseTwoPage,
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
