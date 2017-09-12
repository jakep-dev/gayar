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

export interface BenchmarkRateInput {
    companyId: number;
    premiumValue: string;
    limitValue: string;
    naics: string;
    revenueRange: string;
}

export interface BenchmarkRateModel {
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    quartile: RateQuartile;
}

export interface RateQuartile {
    clientRPMPercentile: number;
    clientRPMPercentileValue: number;
    clientRPMPercentileValue_KMB: string;
    maxRPM: number;
    maxRPM_KMB: string;
    minRPM: number;
    minRPM_KMB: string;
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
    clientLimit: any;
    medianLimit: any;
    losses: LimitLosses[];
    lossAboveMedianLimitLabel: string,
    lossBelowMedianLimitLabel: string,
    lossAmountAboveLabel: string,
    lossAmountBelowLabel: string,
    clientLimitLabel : string;
    medianLimitLabel : string;
    lossAmountLabel : string;
    maxLoss: number;
    minLoss: number;
}

export interface LimitLosses {

    lossAmount: number,
    lossBelowLimit: number,
    lossAboveLimit: number
}