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
        path: 'launchpad/:id/browse',
        component: Pages.ToolsLaunchpadBrowsePage
      },
    ]
  }
];

@NgModule({
  declarations: [
    ToolsContainer,
    Pages.ToolsDesignerPage,
    Pages.ToolsLaunchpadPage,
    Pages.ToolsLaunchpadBrowsePage,
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
