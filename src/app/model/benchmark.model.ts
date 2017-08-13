export interface BenchmarkModel {
    
    chartTitle: string;
    filterDescription: string;
    buckets: BenchmarkGroup[];
    xAxis: string;
    yAxis: string;
}

export interface BenchmarkGroup {
    label: string;
    count: number;
    group: string;
}

export interface BenchmarkPremiumDistributionInput {
    searchType: string;
    companyId: number;
    chartType: string;
    clientValue: string;
    naics: string;
    revenueRange: string;
}