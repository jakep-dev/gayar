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
export * from './font.service';
export * from './getFile.service';
export * from './overlay.service';
export * from './application.service';
export * from './format.service';


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
import { FontService } from './font.service';
import { GetFileService } from './getFile.service';
import { OverlayService } from './overlay.service';
import { ApplicationService } from './application.service';
import { FormatService } from './format.service';

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
    FontService,
    GetFileService,
    OverlayService,
    ApplicationService,
    FormatService
];
