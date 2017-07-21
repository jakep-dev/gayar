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
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [ BenchmarkService, SearchService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
