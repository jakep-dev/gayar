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
