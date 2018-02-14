import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { FrequencyDataResponseModel, FrequencyIndustryOverviewModel } from 'app/model/model';
import { BaseServiceClient } from 'app/services/base.service.client';


@Injectable()
export class FrequencyService extends BaseServiceClient {
    private incidentChartView: string = 'main';   
    private lossChartView: string = 'main';   
    constructor(http: HttpClient) {
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

    public getFrequencyHierarchyLossesDataTable(companyId: number): Observable<FrequencyDataResponseModel> {
        try {
            return super.Post<FrequencyDataResponseModel>('/api/getFrequencyHierarchyLossesData', {
                'company_id': companyId
            });
        }
        catch (e) {
        }
    }

    public getIncidentChartView() {
        return this.incidentChartView;
    }

    public setIncidentChartView(chartView: string) {
        this.incidentChartView = chartView;
    }

    public getLossChartView(): string  {
		return this.lossChartView;
	}

	public setLossChartView(value: string ) {
		this.lossChartView = value;
	}

}
