import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/dashboard/dashboard.component';

export const APP_ROUTES: Routes = [
    { path: 'dashboard', component:  DashboardComponent },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];