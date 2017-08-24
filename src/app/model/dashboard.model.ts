export interface BenchmarkScoreModel{
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    score: FinalScore
}

export interface FinalScore{
    finalScore: number;
}

export interface BenchmarkScore {
    chartType: string;
    searchType: string;
    companyId: number;
    naics: string;
    revenue_range: string;
    limit: string;
    retention: string
}