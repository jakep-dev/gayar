import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SeverityDataResponseModel } from 'app/model/model';


@Injectable()
export class SeverityService extends BaseService {
    constructor(http: Http) {
        super(http);
    }

    public getSeverityDataTable(companyId: number, industry: string, revenueRange: string): Observable<SeverityDataResponseModel> {
        try {
            return super.Post<SeverityDataResponseModel>('/api/getSeverityData', {
                'company_id': companyId,
                'industry': industry,
                'revenue_range': revenueRange
            });
        }
        catch (e) {
        }
    }

    public getSeverityTimePeriodData(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getSeverityTimePeriodData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
            });
        }
        catch(e){

        }
    }

    public getSeverityTypeOfLossFlipDetailDataset(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getSeverityTypeOfLossFlipDetailDataset', {
                'company_id': companyId,
                'naics': naics,
                'revenue_range': revenueRange
           });
        }
        catch(e){

        }
    }
    
    public getSeverityTypeOfIncidentFlipDetailDataset(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getSeverityTypeOfIncidentFlipDetailDataset', {
                'company_id': companyId,
                'naics': naics,
                'revenue_range': revenueRange
           });
        }
        catch(e){

        }
    }
}
