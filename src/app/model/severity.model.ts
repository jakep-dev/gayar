export interface SeverityInput {
    searchType: string;
    companyId: number;
    naics: string;
    revenueRange: string;
}

export interface SeverityDataResponseModel {
    peerGroup: Array<SeverityDataModel>,
    company: Array<SeverityDataModel>
}

export interface SeverityDataModel {
    company_name: string;
    type_of_incident: string;
    incident_date: string;
    records_affected: string;
    type_of_loss: string;
    case_description: string;
}

export interface SeverityTimePeriodModel {    
    chartTitle: string;
    filterDescription: string;
    datasets: SeverityTimePeriodGroup[];
    displayText: string;
    withBreak: boolean;
    maxValue: number;
    xAxis: string;
    yAxis: string;
}

export interface SeverityTimePeriodGroup{
    period: string;
    count: number;
    compOrPeer: string;
    ruleTypeCode: string;
    ruleTypeSubCode: number;
}

export interface SeverityIndustryOverviewModel {
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    xAxis: string;
    yAxis: string;
    datasets: Array<SeverityIndustryOverviewDataset>
}

export interface SeverityIndustryOverviewDataset {
    incidentCount: string;
    revenueRange: string;
    description: string;
}
export interface SeverityLossPieFlipModel{
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    datasets : SeverityDataLossPieSetsGroup[];
}

export interface SeverityDataLossPieSetsGroup{
    pct_count: number;
    sub_type: string;
    type: string;
}
export interface SeverityIncidentPieFlipModel{
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    datasets : SeveritydataIncidentPieSetsGroup[];
}

export interface SeveritydataIncidentPieSetsGroup{
    pct_count: number;
    sub_type: string;
    type: string;
}
