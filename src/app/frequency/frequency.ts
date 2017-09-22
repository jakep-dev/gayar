export * from './frequency.component';

import { FrequencyComponent } from './frequency.component';
import { IndustryOverviewComponent } from './industry-overview/industry-overview.component';

import { IncidentComponent } from './incident/incident.component';
import { IncidentPieComponent } from './incident-pie/incident-pie.component';

export const BLOCK_FREQUENCY = [
    FrequencyComponent,
    IndustryOverviewComponent,
    IncidentComponent,
    IncidentPieComponent
];
