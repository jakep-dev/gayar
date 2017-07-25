import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BenchmarkModel } from 'app/model/model';

@Injectable()
export class BenchmarkService extends BaseService {
    constructor(http: Http) {
        super(http);
    }

    public getBenchmarkPremiumByCompanyId(clientValue: string, chartType: string, companyId: number) : Observable<BenchmarkModel> {
        try{
           return super.Post<BenchmarkModel>('/api/getDistributionDataset', {
               'clientValue': clientValue,
               'chartType': chartType,
               'companyId': companyId
           });    
        }
        catch(e){

        }
    }

        public getBenchmarkPremiumByManualInput(clientValue: string, chartType: string, naics: string, revenueRange: string) : Observable<BenchmarkModel> {
        try{
           return super.Post<BenchmarkModel>('/api/getDistributionDataset', {
               'clientValue': clientValue,
               'chartType': chartType,
               'naics': naics,
               'revenueRange': revenueRange
            });    
        }
        catch(e){

        }
    }

    public getChartDataByCompanyId(clientValue: string, chartType: string, companyId: number) : Observable<BenchmarkModel> {
        try{
           return super.Post<BenchmarkModel>('/api/getChartDataByCompanyId', {
               'clientValue': clientValue,
               'chartType': chartType,
               'companyId': companyId
           });    
        }
        catch(e){

        }
    }

    public getChartDataByManualInput(clientValue: string, naics: string, revenueRange: string): Observable<BenchmarkModel>{
        try{
            return super.Post<BenchmarkModel>('/api/getChartDataByManualInput', {
               'clientValue': clientValue,
               'naics': naics,
               'revenueRange': revenueRange
           });
        }
        catch(e){
            
        }
    }

    public getRatePerMillion(companyId: number): Observable<any>{
        try{
            return super.Post<any>('/api/getRatePerMillion', {
               'companyId': companyId
           });
        }
        catch(e){

        }
    }

    public getLimitAdequacy(companyId: number, limit: number): Observable<any>{
        try{
            return super.Post<any>('/api/getLimitAdequacy', {
               'companyId': companyId,
               'limit': limit
           });
        }
        catch(e){

        }
    }
}