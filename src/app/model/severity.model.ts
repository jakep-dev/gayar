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
