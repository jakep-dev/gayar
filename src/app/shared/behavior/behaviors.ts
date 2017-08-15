import { BenchmarkPremiumDistributionDirective } from './benchmark-premium-distribution';
import { BenchmarkRateDistributionDirective } from './benchmark-rate-distribution';
import { BenchmarkRetentionDistributionDirective } from './benchmark-retention-distribution';
import { BenchmarkLimitDistributionDirective } from './distribution.directive';

export const BLOCK_CHART_BEHAVIORS = [
    BenchmarkPremiumDistributionDirective,
    BenchmarkRateDistributionDirective,
    BenchmarkRetentionDistributionDirective,
    BenchmarkLimitDistributionDirective
];