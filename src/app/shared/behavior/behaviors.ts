import { BenchmarkPremiumDistributionDirective } from './benchmark-premium-distribution.directive';
import { BenchmarkRateDistributionDirective } from './benchmark-rate-distribution.directive';
import { BenchmarkRetentionDistributionDirective } from './benchmark-retention-distribution.directive';
import { BenchmarkLimitDistributionDirective } from './benchmark-limit-distribution.directive';
import { BenchmarkPeerGroupLossDistributionDirective } from './benchmark-peergrouploss-distribution.directive';
import { BenchmarkScoreDirective } from './benchmark-score.directive';

export const BLOCK_CHART_BEHAVIORS = [
    BenchmarkPremiumDistributionDirective,
    BenchmarkRateDistributionDirective,
    BenchmarkRetentionDistributionDirective,
    BenchmarkLimitDistributionDirective,
    BenchmarkPeerGroupLossDistributionDirective,
    BenchmarkScoreDirective
];