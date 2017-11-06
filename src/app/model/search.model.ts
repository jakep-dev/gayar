import { ResponseModel } from './response.model';

export interface SearchModel {
   companies: Array<CompanyModel>,
   resp: ResponseModel
}

export interface IndustryResponseModel{
    industries: Array<IndustryModel>,
    resp: ResponseModel
}

export interface RevenueRangeResponseModel{
    rangeList: Array<RevenueModel>,
    resp: ResponseModel
}

export interface CompanyModel {
    isSelected: boolean;
    companyId: number;
    ticker: string;
    exchange: string;
    depthScore: number;
    companyName: string;
    city: string;
    state: string;
    country: string;
    topLevel: string;
    status: string;
    filter: string;
}

export interface SearchCriteriaModel {
    type: string;
    value: string;
    revenue: RevenueModel;
    industry: IndustryModel;
    premium: string;
    retention: string;
    limit: string;
    filter: string;
}

export interface IndustryModel {
    naics: string;
    naicsDescription: string;
    displayName: string;
}

export interface SearchByModel {
    id: number;
    description: string;
    type: string;
    rule: string;
}

export interface RevenueModel {
    id: number;
    rangeDisplay: string;
    range: string;
}

export interface ValidationMessageModel {
    resp: ResponseModel,
    message: string
}

export interface ValidationPeerGroupLossModel{
    limit: number,
    retention: number,
    naics: string,
    company_id: number,
    hasFrequencyData: boolean,
    hasSeverityData: boolean
}
