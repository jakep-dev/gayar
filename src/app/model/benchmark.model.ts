export interface BenchmarkModel {
    
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    xAxis: string;
    yAxis: string;
    buckets: BenchmarkGroup[];
}

export interface BenchmarkGroup {
    label: string;
    count: number;
    group: string;
}

export interface BenchmarkDistributionInput {
    searchType: string;
    companyId: number;
    premiumValue: string;
    limitValue: string;
    retentionValue: string;
    naics: string;
    revenueRange: string;
}

export interface BenchmarkLimitAdequacyInput {
    searchType: string;
    companyId: number;
    limits: string;
    naics: string;
    revenueRange: string
}

export interface BenchmarkRateModel {
    chartTitle: string;
    filterDescription: string;
    quartile: RateQuartile;
}

export interface RateQuartile {
    clientRPMPercentile: number;
    clientRPMPercentileValue: number;
    clientRPMPercentileValue_KMB: string;
    maxRPM: number;
    minRPM: number;
    firstQuartile: number;
    firstQuartile_KMB: string;
    median: number;
    median_KMB: string;
    fourthQuartile: number;
    fourthQuartile_KMB: string;
}

export interface BenchmarkLimitModel {
    
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    xAxis: string;
    yAxis: string;
    clientLimit: string;
    medianLimit: string;
    losses: LimitLosses[];
}

export interface LimitLosses {

    lossAmount: number,
    lossBelowLimit: number,
    lossAboveLimit: number
}