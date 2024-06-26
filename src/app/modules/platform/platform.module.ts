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
        path: 'tokenomics',
        component: Pages.PlatformTokenomicsPage
      },
    ]
  }
];

@NgModule({
  declarations: [
    PlatformContainer,
    Pages.PlatformTokenomicsPage,
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
