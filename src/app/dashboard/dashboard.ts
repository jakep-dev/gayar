export * from './dashboard.component';

import { BenchmarkComponent } from './benchmark/benchmark.component';
import { FrequencyComponent } from './frequency/frequency.component';
import { ImpactComponent } from './impact/impact.component';
import { DashboardComponent } from './dashboard.component';

export const BLOCK_DASHBOARD = [
    BenchmarkComponent,
    FrequencyComponent,
    ImpactComponent,
    DashboardComponent
];
