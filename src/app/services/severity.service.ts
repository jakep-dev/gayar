import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SeverityDataResponseModel, SeverityIndustryOverviewModel } from 'app/model/model';


@Injectable()
export class SeverityService extends BaseService {

    private incidentChartView: string = 'main';   
    private lossChartView: string = 'main';   
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

    public getSeverityTimePeriodData(companyId: number, naics: string, revenueRange: string): Observable<any> {
        try {
            return super.Post<any>('/api/getSeverityTimePeriodData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
            });
        }
        catch (e) {

        }
    }

    public getSeverityIndustryOverview(companyId: number, naics: string): Observable<SeverityIndustryOverviewModel> {
        try {
            return super.Post<SeverityIndustryOverviewModel>('/api/severity/getIndustryOverviewDisplayDataset', {
                'companyId': companyId,
                'naics': naics
            });
        }
        catch (e) {

        }
    }

    public getSeverityTypeOfLossFlipDetailDataset(companyId: number, naics: string, revenueRange: string): Observable<any> {
        try {
            return super.Post<any>('/api/getSeverityTypeOfLossFlipDetailDataset', {
                'company_id': companyId,
                'naics': naics,
                'revenue_range': revenueRange
            });
        }
        catch (e) {

        }
    }

    public getSeverityTypeOfIncidentFlipDetailDataset(companyId: number, naics: string, revenueRange: string): Observable<any> {
        try {
            return super.Post<any>('/api/getSeverityTypeOfIncidentFlipDetailDataset', {
                'company_id': companyId,
                'naics': naics,
                'revenue_range': revenueRange
            });
        }
        catch (e) {

        }
    }

    public getSeverityTypeOfIncidentBarData(companyId: number, naics: string, revenueRange: string): Observable<any> {
        try {
            return super.Post<any>('/api/getSeverityTypeOfIncidentBarData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
            });
        }
        catch (e) {
        }
    }    

    public getSeverityTypeOfLossBarData(companyId: number, naics: string, revenueRange: string): Observable<any>{
        try{
            return super.Post<any>('/api/getSeverityTypeOfLossBarData', {
                'companyId': companyId,
                'naics': naics,
                'revenueRange': revenueRange
            });
        }
        catch(e){

        }
    }

    public getIncidentChartView(): string  {
		return this.incidentChartView;
	}

	public setIncidentChartView(value: string ) {
		this.incidentChartView = value;
    }

    public getLossChartView(): string  {
		return this.lossChartView;
	}

	public setLossChartView(value: string ) {
		this.lossChartView = value;
	}
    

}
