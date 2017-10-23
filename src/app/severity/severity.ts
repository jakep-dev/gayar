export * from './severity.component';

import { SeverityComponent } from './severity.component';
import { TimePeriodComponent } from './time-period/time-period.component';
import { IndustryOverviewComponent } from './industry-overview/industry-overview.component';

export const BLOCK_SEVERITY = [ 
    SeverityComponent,
    TimePeriodComponent,
    IndustryOverviewComponent
];
