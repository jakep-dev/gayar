export * from './benchmark.service';
export * from './search.service';
export * from './session.service';
export * from './auth-activator.service';
export * from './menu.service';
export * from './dashboard.service';


import { BenchmarkService } from './benchmark.service';
import { SearchService } from './search.service';
import { SessionService } from './session.service';
import { MenuService } from './menu.service';
import { AuthRouteActivatorService } from './auth-activator.service';
import { DashboardService } from './dashboard.service';

export const BLOCK_SERVICES = [
    BenchmarkService,
    SearchService,
    SessionService,
    MenuService,
    AuthRouteActivatorService,
    DashboardService
];


