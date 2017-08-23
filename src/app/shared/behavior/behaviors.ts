import { BenchmarkPremiumDistributionDirective } from './benchmark/benchmark-premium-distribution.directive';
import { BenchmarkRateDistributionDirective } from './benchmark/benchmark-rate-distribution.directive';
import { BenchmarkRetentionDistributionDirective } from './benchmark/benchmark-retention-distribution.directive';
import { BenchmarkLimitDistributionDirective } from './benchmark/benchmark-limit-distribution.directive';
import { BenchmarkPeerGroupLossDistributionDirective } from './benchmark/benchmark-peergrouploss-distribution.directive';

export const BLOCK_CHART_BEHAVIORS = [
    BenchmarkPremiumDistributionDirective,
    BenchmarkRateDistributionDirective,
    BenchmarkRetentionDistributionDirective,
    BenchmarkLimitDistributionDirective,
    BenchmarkPeerGroupLossDistributionDirective
];