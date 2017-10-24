export * from './severity.component';

import { SeverityComponent } from './severity.component';
import { TimePeriodComponent } from './time-period/time-period.component';
import { IndustryOverviewComponent } from './industry-overview/industry-overview.component';
import { LossPieComponent } from './loss-pie/loss-pie.component';
import { IncidentPieComponent } from './incident-pie/incident-pie.component';
import { IncidentBarComponent } from './incident-bar/incident-bar.component';
import { LossBarComponent } from './loss-bar/loss-bar.component';

export const BLOCK_SEVERITY = [ 
    SeverityComponent,
    TimePeriodComponent,
    IndustryOverviewComponent,
    LossPieComponent,
    IncidentPieComponent,
    IncidentBarComponent,
    LossBarComponent
];
