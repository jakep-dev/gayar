//Library Components
import 'hammerjs';
import 'jspdf';
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

import { DragulaModule } from "ng2-dragula";
import { ChartModule } from 'angular2-highcharts';
import { HighchartsProvider } from './shared/highchart/highchart';

// Application Components
import { BLOCK_SHARED, BLOCK_ERRORS, BLOCK_CHART_TYPES,
		 BLOCK_CONSTRAINTS, BLOCK_CHART_BEHAVIORS,
		 BLOCK_SHARED_SERVICE } from './shared/shared';
import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { BLOCK_DASHBOARD } from './dashboard/dashboard';
import { BLOCK_BENCHMARK } from './benchmark/benchmark';
import { BLOCK_FREQUENCY } from './frequency/frequency';
import { BLOCK_SEVERITY } from './severity/severity';
import { MenuComponent } from './shared/layouts/menu/menu.component';
import { SearchComponent } from './search/search.component';
import { ReportComponent } from './report/report.component';
import { PdfDownloadComponent } from './pdf-download/pdf-download.component';
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
		BLOCK_FREQUENCY,
		BLOCK_SEVERITY,
		MenuComponent,
		SearchComponent,
		ReportComponent,
		PdfDownloadComponent,
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
		FlexLayoutModule,
		MaterialModule,
		MdSnackBarModule,
		MdDialogModule,
		CdkTableModule,
		DragulaModule,
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
