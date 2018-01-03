import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class DashboardRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    //Get Benchmark Score chart details
    public getBenchmarkScore(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getBenchmarkScore", {
                'ssnid': req.header('authorization'),
                'company_id': req.body.companyId,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange,
                'limit': req.body.limit,
                'retention': req.body.retention
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }
    
    //Get Frequency Score chart details
    public getFrequencyScore(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getFrequencyScore", {
                'ssnid': req.header('authorization'),
                'company_id': req.body.companyId,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange,
                'limit': req.body.limit,
                'retention': req.body.retention
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }

     //Get Severity Score chart details
     public getSeverityScore(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getSeverityScore", {
                'ssnid': req.header('authorization'),
                'company_id': req.body.companyId,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange,
                'limit': req.body.limit,
                'retention': req.body.retention
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }
    
    init(){
        this.app.post('/api/getBenchmarkScore', this.getBenchmarkScore);
        this.app.post('/api/getFrequencyScore', this.getFrequencyScore);
        this.app.post('/api/getSeverityScore', this.getSeverityScore);
    }
    
}

