export * from './severity.component';

import { SeverityComponent } from './severity.component';
import { TimePeriodComponent } from './time-period/time-period.component';
import { LossPieComponent } from './loss-pie/loss-pie.component';

export const BLOCK_SEVERITY = [
    SeverityComponent,
    TimePeriodComponent,
    LossPieComponent
];
