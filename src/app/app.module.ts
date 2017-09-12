//Library Components
import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule, MdSnackBarModule, MdDialogModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

import { ChartModule } from 'angular2-highcharts';
import { HighchartsProvider } from './shared/highchart/highchart';

// Application Components
import { BLOCK_SHARED, BLOCK_ERRORS, BLOCK_CHART_TYPES , 
         BLOCK_CONSTRAINTS, BLOCK_CHART_BEHAVIORS, BLOCK_SHARED_SERVICE } from './shared/shared';
import { AppComponent } from './app.component';
import { APP_ROUTES  } from './app.routes';
import { BLOCK_DASHBOARD  } from './dashboard/dashboard';
import { BLOCK_BENCHMARK } from './benchmark/benchmark';
import { MenuComponent } from './shared/layouts/menu/menu.component';
import { SearchComponent } from './search/search.component';
import { BLOCK_SERVICES } from './services/services';
import { SsoComponent } from './sso/sso.component';
import { BLOCK_PIPES } from './shared/pipes/pipes';
import { SearchTableComponent } from './shared/tables/search-table/search-table.component';
import { SearchTableMobileComponent } from './shared/tables/search-table-mobile/search-table-mobile.component';

@NgModule({
  declarations: [
    BLOCK_SHARED,
    BLOCK_ERRORS,
    AppComponent,
    BLOCK_DASHBOARD,
    BLOCK_BENCHMARK,
    MenuComponent,
    SearchComponent,  
    SsoComponent,
    BLOCK_CHART_TYPES,
    BLOCK_CHART_BEHAVIORS,
    BLOCK_CONSTRAINTS,
    BLOCK_PIPES,
    SearchTableComponent,
    SearchTableMobileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    CommonModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    MdSnackBarModule,
    MdDialogModule,
    CdkTableModule,
    ChartModule,
    RouterModule.forRoot(APP_ROUTES)
  ],

  providers: [
    HighchartsProvider,
    BLOCK_SERVICES,
    BLOCK_SHARED_SERVICE
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
