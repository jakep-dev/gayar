import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseServiceClient } from 'app/services/base.service.client';

@Injectable()
export class DashboardService extends BaseServiceClient {
    constructor(http: HttpClient) {
        super(http);
    }

    public getBenchmarkScore (companyId: number, chartType: string, limit: string, retention: string): Observable<any> {
        try{
            return super.Post<any>('/api/getBenchmarkScore', {
                'companyId': companyId,
                'chartType': chartType,
                'limit': limit,
                'retention': retention
           });
        }
        catch(e){

        }
    }

    public getBenchmarkScoreByManualInput (chartType: string, naics: string, revenueRange: string, limit: string, retention: string): Observable<any>{
        try{
            return super.Post<any>('/api/getBenchmarkScore', {
                'chartType': chartType,
                'naics': naics,
                'revenueRange': revenueRange,
                'limit': limit,
                'retention': retention
           });
        }
        catch(e){

        }
    }

    public getFrequencyScore (companyId: number, naics: string, revenueRange: string, limit: string, retention: string): Observable<any>{
        try{
            return super.Post<any>('/api/getFrequencyScore', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange,
                'limit': limit,
                'retention': retention
           });
        }
        catch(e){

        }
    }

    public getSeverityScore (companyId: number, naics: string, revenueRange: string, limit: string, retention: string): Observable<any>{
        try{
            return super.Post<any>('/api/getSeverityScore', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange,
                'limit': limit,
                'retention': retention
           });
        }
        catch(e){

        }
    }
}
