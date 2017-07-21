import { ResponseModel } from './response.model';

export interface SearchModel {
   companies: Array<CompanyModel>,
   resp: ResponseModel
}

export interface CompanyModel {
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

export interface IndustryModel {
    naics: string;
    naicsDescription: string;
}

export interface SearchByModel {
    id: number;
    description: string;
    type: string;
}