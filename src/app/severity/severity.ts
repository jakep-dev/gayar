export * from './severity.component';

import { SeverityComponent } from './severity.component';
import { TimePeriodComponent } from './time-period/time-period.component';
import { IndustryOverviewComponent } from './industry-overview/industry-overview.component';
import { LossPieComponent } from './loss-pie/loss-pie.component';
import { IncidentPieComponent } from './incident-pie/incident-pie.component';

export const BLOCK_SEVERITY = [ 
    SeverityComponent,
    TimePeriodComponent,
    IndustryOverviewComponent,
    LossPieComponent,
    IncidentPieComponent
];
