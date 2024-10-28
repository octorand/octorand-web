import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { LibModule } from '@lib';
import { CollectionModule, GamesModule, PlatformModule, ToolsModule } from '@app/modules';
import { AppComponent } from './app.component';
import { environment } from '@environment';
import * as Pages from '@app/pages';

const routes: Routes = [
  {
    path: '',
    component: Pages.AppHomePage
  },
  {
    path: 'collection',
    loadChildren: () => CollectionModule
  },
  {
    path: 'platform',
    loadChildren: () => PlatformModule
  },
  {
    path: 'games',
    loadChildren: () => GamesModule
  },
  {
    path: 'tools',
    loadChildren: () => ToolsModule
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  }
];

@NgModule({
  declarations: [
    AppComponent,
    Pages.AppHomePage,
  ],
  imports: [
    BrowserModule,
    LibModule,
    RouterModule.forRoot(routes),
    NgxGoogleAnalyticsModule.forRoot(environment.analytics_code),
    NgxGoogleAnalyticsRouterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
