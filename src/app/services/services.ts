export * from './benchmark.service';
export * from './search.service';
export * from './session.service';
export * from './auth-activator.service';
export * from './menu.service';
export * from './dashboard.service';
export * from './frequency.service';
export * from './severity.service'
export * from './session-storage.service';
export * from './report.service';
export * from './application.service';


import { BenchmarkService } from './benchmark.service';
import { SearchService } from './search.service';
import { SessionService } from './session.service';
import { MenuService } from './menu.service';
import { AuthRouteActivatorService } from './auth-activator.service';
import { DashboardService } from './dashboard.service';
import { FrequencyService } from './frequency.service';
import { SeverityService } from './severity.service';
import { SessionStorageService } from './session-storage.service';
import { ReportService } from './report.service';
import { ApplicationService } from './application.service';

export const BLOCK_SERVICES = [
    BenchmarkService,
    SearchService,
    SessionService,
    MenuService,
    AuthRouteActivatorService,
    DashboardService,
    FrequencyService,
    SeverityService,
    SessionStorageService,
    ReportService,
    ApplicationService
];
