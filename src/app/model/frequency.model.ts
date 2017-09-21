export interface FrequencyInput {
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

export interface FrequencyIncidentBarModel {
    
    chartTitle: string;
    filterDescription: string;
    datasets: FrequencyIncidentGroup[];
    displayText: string;
    withBreak: boolean;
    xAxis: string;
    yAxis: string;
}

export interface FrequencyIncidentGroup {
    comp_or_peer: string;
    count: number;
    type: string;
    sub_type: string;
}