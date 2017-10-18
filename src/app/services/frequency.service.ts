import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { FrequencyDataResponseModel, FrequencyIndustryOverviewModel } from 'app/model/model';


@Injectable()
export class FrequencyService extends BaseService {
    constructor(http: Http) {
        super(http);
    }

    public getFrequencyDataTable(companyId: number, industry: string, revenue: string): Observable<FrequencyDataResponseModel> {
        try {
            return super.Post<FrequencyDataResponseModel>('/api/getFrequencyData', {
                'company_id': companyId,
                'industry': industry,
                'revenue_range': revenue
            });
        }
        catch (e) {
        }
    }    

    public getTypeOfIncidentBarData(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getTypeOfIncidentBarData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
           });
        }
        catch(e){

        }
    }
    
    public getTypeOfLossBarData(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getTypeOfLossBarData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
            });
        }
        catch(e){

        }
    }

    public getFrequencyIndustryOverview( companyId: number, naics : string) : Observable<FrequencyIndustryOverviewModel> {
        try{
           return super.Post<FrequencyIndustryOverviewModel>('/api/getIndustryOverviewDisplayDataset', {
               'companyId': companyId,
               'naics': naics
           });    
        }
        catch(e){

        }
    }

    public getTypeOfIncidentFlipDetailDataset(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getTypeOfIncidentFlipDetailDataset', {
                'company_id': companyId,
                'naics': naics,
                'revenue_range': revenueRange
           });
        }
        catch(e){

        }
    }
    
    public getTimePeriodData(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getTimePeriodData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
            });
        }
        catch(e){

        }
    }

    public getTypeOfLossFlipDetailDataset(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getTypeOfLossFlipDetailDataset', {
                'company_id': companyId,
                'naics': naics,
                'revenue_range': revenueRange
           });
        }
        catch(e){

        }
    }
}
