import { ResponseModel } from './response.model';

export interface SearchModel {
   companies: Array<CompanyModel>,
   resp: ResponseModel
}

export interface IndustryResponseModel{
    industries: Array<IndustryModel>,
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
}

export interface SearchCriteriaModel {
    type: string;
    value: string;
    revenue: RevenueModel;
    industry: IndustryModel;
    premium: string;
    retention: string;
    limit: string;
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
    description: string;
    value: string;
}

export interface ValidationMessageModel {
    resp: ResponseModel, 
    message: string
}