export * from './severity.component';

import { SeverityComponent } from './severity.component';
import { TimePeriodComponent } from './time-period/time-period.component';
import { IncidentPieComponent } from './incident-pie/incident-pie.component';

export const BLOCK_SEVERITY = [
    SeverityComponent,
    TimePeriodComponent,
    IncidentPieComponent
];
