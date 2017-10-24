import { BenchmarkPremiumDistributionDirective } from './benchmark/benchmark-premium-distribution.directive';
import { BenchmarkRateDistributionDirective } from './benchmark/benchmark-rate-distribution.directive';
import { BenchmarkRetentionDistributionDirective } from './benchmark/benchmark-retention-distribution.directive';
import { BenchmarkLimitDistributionDirective } from './benchmark/benchmark-limit-distribution.directive';
import { BenchmarkPeerGroupLossDistributionDirective } from './benchmark/benchmark-peergrouploss-distribution.directive';
import { BenchmarkScoreDirective } from './dashboard/benchmark-score.directive';

import { FrequencyIndustryOverviewDirective } from './frequency/frequency-industry-overview.directive';
import { FrequencyTimePeriodDirective } from './frequency/frequency-time-period.directive';
import { FrequencyIncidentBarDirective } from './frequency/frequency-incident-bar.directive';
import { FrequencyLossBarDirective } from './frequency/frequency-loss-bar.directive';
import { FrequencyIncidentPieDirective } from './frequency/frequency-incident-pie.directive';
import { FrequencyLossPieDirective } from 'app/shared/behavior/frequency/frequency-loss-pie.directive';
import { SeverityTimePeriodDirective } from './severity/severity-time-period.directive';
import { SeverityIndustryOverviewDirective } from './severity/severity-industry-overview.directive';
import { SeverityLossPieDirective } from './severity/severity-loss-pie.directive';
import { SeverityIncidentPieDirective } from 'app/shared/behavior/severity/severity-incident-pie.directive';
import { SeverityIncidentBarDirective } from 'app/shared/behavior/severity/severity-incident-bar.directive';
import { SeverityLossBarDirective } from 'app/shared/behavior/severity/severity-loss-bar.directive';

export const BLOCK_CHART_BEHAVIORS = [
    BenchmarkPremiumDistributionDirective,
    BenchmarkRateDistributionDirective,
    BenchmarkRetentionDistributionDirective,
    BenchmarkLimitDistributionDirective,
    BenchmarkPeerGroupLossDistributionDirective,
    BenchmarkScoreDirective,
    FrequencyIndustryOverviewDirective,
    FrequencyTimePeriodDirective,
    FrequencyIncidentBarDirective,
    FrequencyIncidentPieDirective,
    FrequencyLossBarDirective,
    FrequencyLossPieDirective,
    SeverityTimePeriodDirective,
    SeverityIndustryOverviewDirective,
    SeverityLossPieDirective,
    SeverityIncidentPieDirective,
    SeverityIncidentBarDirective,
    SeverityLossBarDirective
];