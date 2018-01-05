import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard';
import { BenchmarkComponent } from 'app/benchmark/benchmark';
import { FrequencyComponent} from 'app/frequency/frequency';
import { SeverityComponent} from 'app/severity/severity';
import { SearchComponent } from 'app/search/search.component';
import { ReportComponent } from 'app/report/report.component';
import { GlossaryComponent } from 'app/glossary/glossary.component';
import { PdfDownloadComponent } from 'app/pdf-download/pdf-download.component';
import { SsoComponent } from 'app/sso/sso.component';
import { AuthRouteActivatorService } from './services/services';
import { E401Component, E500Component, E403Component, NoAccessComponent } from './shared/shared';

export const APP_ROUTES: Routes = [
    { path: 'dashboard',    component:  DashboardComponent, canActivate: [ AuthRouteActivatorService ]},
    { path: 'benchmark',    component:  BenchmarkComponent, canActivate: [ AuthRouteActivatorService ]},
    { path: 'frequency',    component:  FrequencyComponent, canActivate: [ AuthRouteActivatorService ]},
    { path: 'severity',     component:  SeverityComponent,  canActivate: [ AuthRouteActivatorService ]},
    { path: 'search',       component:  SearchComponent,    canActivate: [ AuthRouteActivatorService ]},
    { path: 'report',       component:  ReportComponent},
    { path: 'glossary',     component:  GlossaryComponent},
    { path: 'pdfdownload',  component:  PdfDownloadComponent},
    { path: 'sso/:userId',  component:  SsoComponent },
    { path: 'noAccess',     component:  NoAccessComponent },
    { path: 'error',        component:  E500Component },
    { path: '401',          component:  E401Component },
    { path: '403',          component:  E403Component }
];
