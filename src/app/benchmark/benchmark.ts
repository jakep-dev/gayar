export * from './benchmark.component';

import { LimitComponent } from './limit/limit.component';
import { PeerGroupLossComponent } from './peer-group-loss/peer-group-loss.component';
import { PremiumComponent } from './premium/premium.component';
import { RateComponent } from './rate/rate.component';
import { RetentionComponent } from './retention/retention.component';
import { BenchmarkComponent } from './benchmark.component';

export const BLOCK_BENCHMARK = [
    LimitComponent,
    PeerGroupLossComponent,
    PremiumComponent,
    RateComponent,
    RetentionComponent,
    BenchmarkComponent
];