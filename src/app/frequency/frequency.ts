export * from './frequency.component';

import { FrequencyComponent } from './frequency.component';
import { IndustryOverviewComponent } from './industry-overview/industry-overview.component';
import { TimePeriodComponent } from './time-period/time-period.component';
import { IncidentBarComponent } from './incident-bar/incident-bar.component';
import { LossBarComponent } from './loss-bar/loss-bar.component';
import { IncidentPieComponent } from './incident-pie/incident-pie.component';

export const BLOCK_FREQUENCY = [
    FrequencyComponent,
    IndustryOverviewComponent,
    TimePeriodComponent,
    IncidentBarComponent,
    IncidentPieComponent,
    LossBarComponent
];
