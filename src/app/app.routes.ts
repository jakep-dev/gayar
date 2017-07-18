import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard';
import { BenchmarkComponent } from 'app/benchmark/benchmark';

export const APP_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent },
    { path: 'benchmark', component:  BenchmarkComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];