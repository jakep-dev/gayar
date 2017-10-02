export interface FrequencyInput {
    searchType: string;
    companyId: number;
    naics: string;
    revenueRange: string;
}

export interface FrequencyDataResponseModel {
    peerGroup: Array<FrequencyDataModel>,
    company: Array<FrequencyDataModel>
}

export interface FrequencyDataModel {
    company_name: string;
    type_of_incident: string;
    incident_date: string;
    records_affected: string;
    type_of_loss: string;
    case_description: string;
}

export interface FrequencyIndustryOverviewModel {
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    xAxis: string;
    yAxis: string;
    datasets: Array<IndustryOverviewDataset>

}      
export interface IndustryOverviewDataset {
    incidentCount: string;
    revenueRange: string;
    description: string;
}


export interface FrequencyIndustryOverviewInput {
    companyId: number;
    naics: string;

}

export interface FrequencyIncidentBarModel {
    
    chartTitle: string;
    filterDescription: string;
    datasets: FrequencyIncidentGroup[];
    displayText: string;
    withBreak: boolean;
    maxValue: number;
    xAxis: string;
    yAxis: string;
}

export interface FrequencyIncidentGroup {
    comp_or_peer: string;
    count: number;
    type: string;
    sub_type: string;
}

export interface FrequencyLossBarModel {
    
    chartTitle: string;
    filterDescription: string;
    datasets: FrequencyLossGroup[];
    displayText: string;
    withBreak: boolean;
    maxValue: number;
    xAxis: string;
    yAxis: string;
}

export interface FrequencyLossGroup {
    comp_or_peer: string;
    count: number;
    type: string;
    sub_type: string;
}

export interface FrequencyIncidentPieFlipModel{
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    datasets : DataSetsGroup[];
}

export interface DataSetsGroup{
    pct_count: string;
    sub_type: string;
    type: string;
}

export interface FrequencyIncidentPieFlipData {
    searchType: string;
    companyId: number;
    naics: string;
    revenueRange: string;
}

export interface FrequencyTimePeriodModel {    
    chartTitle: string;
    filterDescription: string;
    datasets: FrequencyTimePeriodGroup[];
    displayText: string;
    withBreak: boolean;
    maxValue: number;
    xAxis: string;
    yAxis: string;
}

export interface FrequencyTimePeriodGroup{
    period: string;
    count: number;
    compOrPeer: string;
    ruleTypeCode: string;
    ruleTypeSubCode: number;
}

export interface FrequencyLossPieFlipModel{
    chartTitle: string;
    filterDescription: string;
    displayText: string;
    datasets : DataLossPieSetsGroup[];
}

export interface DataLossPieSetsGroup{
    pct_count: number;
    sub_type: string;
    type: string;
}

export interface FrequencyLossPieFlipData {
    searchType: string;
    companyId: number;
    naics: string;
    revenueRange: string;
}