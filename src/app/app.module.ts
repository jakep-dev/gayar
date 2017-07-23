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
import {HighchartsStatic} from 'angular2-highcharts/dist/HighchartsService';
//import * as highcharts from 'highcharts';

export function highchartsFactory() {
    var hc = require('highcharts');
    // var dd = require('highcharts/modules/drilldown');
    var nd = require('highcharts/modules/no-data-to-display');
    // var hcm = require('highcharts/highcharts-more');
     var exp = require('highcharts/modules/exporting');
    // var ct = require('highcharts/modules/canvas-tools');

    // dd(hc);
    nd(hc);
    // hcm(hc);
    exp(hc);
    // ct(hc);
    return hc;
}

// Application Components
import { TileComponent } from './shared/shared';
import { AppComponent } from './app.component';
import { APP_ROUTES  } from './app.routes';
import { BLOCK_DASHBOARD  } from './dashboard/dashboard';
import { BLOCK_BENCHMARK } from './benchmark/benchmark';
import { MenuComponent } from './shared/layouts/menu/menu.component';
import { SearchComponent } from './search/search.component';
import { BenchmarkService, SearchService } from './services/services';
import { TableComponent } from './shared/table/table.component';


@NgModule({
  declarations: [
    TileComponent,
    AppComponent,
    BLOCK_DASHBOARD,
    BLOCK_BENCHMARK,
    MenuComponent,
    SearchComponent,
    TableComponent
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
    {
      provide: HighchartsStatic,
      //useValue: highcharts
      useFactory: highchartsFactory
    },
    BenchmarkService, 
    SearchService 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
