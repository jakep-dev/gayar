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
                'ssnid': req.body.token,
                'company_id': req.body.companyId,
                'naics': req.body.naics,
                'revenue_range': req.body.revenue_range,
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
    }
}

