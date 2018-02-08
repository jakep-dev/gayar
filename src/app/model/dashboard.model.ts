export interface DashboardScoreModel{
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    score: FinalScore
}

export interface FinalScore{
    finalScore: number;
}

export interface DashboardScore {
    chartType: string;
    searchType: string;
    companyId: number;
    naics: string;
    revenueRange: string;
    limit: string;
    retention: string
}