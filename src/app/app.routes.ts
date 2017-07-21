import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard';
import { BenchmarkComponent } from 'app/benchmark/benchmark';
import { SearchComponent } from 'app/search/search.component';

export const APP_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent },
    { path: 'benchmark', component:  BenchmarkComponent },
    { path: 'search', component:  SearchComponent },
    { path: '', redirectTo: '/search', pathMatch: 'full' }
];