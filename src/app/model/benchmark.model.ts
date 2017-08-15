export interface BenchmarkModel {
    
    chartTitle: string;
    filterDescription: string;
    buckets: BenchmarkGroup[];
    xAxis: string;
    yAxis: string;
    displayText: string;
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
