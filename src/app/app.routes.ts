import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard';
import { BenchmarkComponent } from 'app/benchmark/benchmark';
import { SearchComponent } from 'app/search/search.component';
import { SsoComponent } from 'app/sso/sso.component';
import { AuthRouteActivatorService } from './services/services';
import { E401Component } from './shared/shared';

export const APP_ROUTES: Routes = [
    { path: 'dashboard',    component:  DashboardComponent},
    { path: 'benchmark',    component:  BenchmarkComponent},
    { path: 'search',       component:  SearchComponent, canActivate: [ AuthRouteActivatorService ]  },
    { path: 'sso/:userId',  component:  SsoComponent },
    { path: '401',          component:  E401Component}
];