import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { LibModule } from '@lib';
import { CollectionModule } from '@app/collection';
import { AppComponent } from './app.component';
import { environment } from '@environment';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => CollectionModule
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
