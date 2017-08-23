import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService extends BaseService {
    constructor(http: Http) {
        super(http);
    }

    public getBenchmarkScore(companyId: number, chartType: string, limit: string, retention: string): Observable<any>{
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

    public getBenchmarkScoreByManualInput(chartType: string, naics: string, revenue_range: string, limit: string, retention: string): Observable<any>{
        try{
            return super.Post<any>('/api/getBenchmarkScore', {
                'chartType': chartType,
                'naics': naics,
                'revenue_range': revenue_range,
                'limit': limit,
                'retention': retention
           });
        }
        catch(e){

        }
    }
}
