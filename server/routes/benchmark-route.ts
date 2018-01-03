import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class BenchmarkRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    //Get the chart data by companyId
    //Premium, Limit and Retention Chart dataset
    public getChartDataByCompanyId(req: Request, res: Response, next: NextFunction) {
        try{
            super.PerformGetRequest("getDistributionDataSet", {
                'client_value': req.body.clientValue,
                'chart_type': req.body.chartType,
                'company_id': req.body.companyId
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }

    //Get the chart data by manual input
    //Premium, Limit and Retention Chart dataset
    public getChartDataByManualInput(req: Request, res: Response, next: NextFunction) {
        try{
            super.PerformGetRequest("getDistributionDataSet", {
                'client_value': req.body.clientValue,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }

    //Get rate per million chart details
    public getRatePerMillion(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("ratePerMillion", {
                'company_id': req.body.companyId,
                'ssnid': req.header('authorization'),
                'limit': req.body.limit,
                'premium': req.body.premium,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, (data)=>{
                res.send(data);
            });   
        }
        catch(e){
            Logger.error(e);
        }
    }

    //Get limit adequacy chart details
    public getLimitAdequacy(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getLimitAdequacy", {
                'company_id': req.body.companyId,
                'ssnid': req.header('authorization'),
                'limit': req.body.limit,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }

    //Get Benchmark Distribution chart details
    public getDistributionDataset(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getDistributionDataset", {
                'client_value': req.body.clientValue,
                'chart_type': req.body.chartType,
                'ssnid': req.header('authorization'),
                'company_id': req.body.companyId,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }
    
    init(){
       this.app.post('/api/getChartDataByCompanyId', this.getChartDataByCompanyId);
       this.app.post('/api/getChartDataByManualInput', this.getChartDataByManualInput);
       this.app.post('/api/getRatePerMillion', this.getRatePerMillion);
       this.app.post('/api/getLimitAdequacy', this.getLimitAdequacy);
       this.app.post('/api/getDistributionDataset', this.getDistributionDataset);
    }
}

