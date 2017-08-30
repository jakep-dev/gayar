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
import { MaterialModule  } from '@angular/material';
import { CdkTableModule } from '@angular/cdk';

import {ChartModule} from 'angular2-highcharts';
import { HighchartsProvider } from './shared/highchart/highchart';

// Application Components
import { BLOCK_SHARED, BLOCK_ERRORS, BLOCK_CHART_TYPES , BLOCK_CONSTRAINTS, BLOCK_CHART_BEHAVIORS} from './shared/shared';
import { AppComponent } from './app.component';
import { APP_ROUTES  } from './app.routes';
import { BLOCK_DASHBOARD  } from './dashboard/dashboard';
import { BLOCK_BENCHMARK } from './benchmark/benchmark';
import { MenuComponent } from './shared/layouts/menu/menu.component';
import { SearchComponent } from './search/search.component';
import { BLOCK_SERVICES } from './services/services';
import { TableComponent } from './shared/table/table.component';
import { SsoComponent } from './sso/sso.component';
import { BLOCK_PIPES } from './shared/pipes/pipes';

@NgModule({
  declarations: [
    BLOCK_SHARED,
    BLOCK_ERRORS,
    AppComponent,
    BLOCK_DASHBOARD,
    BLOCK_BENCHMARK,
    MenuComponent,
    SearchComponent,  
    TableComponent,
    SsoComponent,
    BLOCK_CHART_TYPES,
    BLOCK_CHART_BEHAVIORS,
    BLOCK_CONSTRAINTS,
    BLOCK_PIPES
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
    CdkTableModule,
    ChartModule,
    RouterModule.forRoot(APP_ROUTES)
  ],

  providers: [
    HighchartsProvider,
    BLOCK_SERVICES
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
