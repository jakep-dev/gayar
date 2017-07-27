export * from './benchmark.service';
export * from './search.service';
export * from './session.service';
export * from './auth-activator.service';

import { BenchmarkService } from './benchmark.service';
import { SearchService } from './search.service';
import { SessionService } from './session.service';
import { AuthRouteActivatorService } from './auth-activator.service';

export const BLOCK_SERVICES = [
    BenchmarkService,
    SearchService,
    SessionService
];


