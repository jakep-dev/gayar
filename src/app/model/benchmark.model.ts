export interface BenchmarkModel {
    
    chartTitle: string;
    filterDescription: string;
    buckets: BenchmarkGroup[];
}

export interface BenchmarkGroup {
    label: string;
    count: number;
    group: string;
}

export interface BenchmarkPremiumDistributionInput {
  companyId: number;
  chartType: string;
  clientValue: number;
  naics: number;
  revenueRange: string;
}