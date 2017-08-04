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