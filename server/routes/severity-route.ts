import { Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class SeverityRouter extends BaseRoute {

    constructor(private app: Application) {
        super();
        this.init();
    }

    //Initialize all the api call endpoints
    init() {
        this.app.post('/api/getSeverityData', this.getSeverityData);
        this.app.post('/api/getSeverityTimePeriodData', this.getSeverityTimePeriodData);
        this.app.post('/api/severity/getIndustryOverviewDisplayDataset', this.getSeverityIndustryOverview);
    }

    public getSeverityData(req: Request, res: Response, next: NextFunction) {
        console.log('===== FETCHING SEVERITY DATA TABLE START =====');
        try {
            super.PerformGetRequest("getSeverityData", {
                'ssnid': req.body.token,
                'company_id': req.body.company_id,
                'industry': req.body.industry,
                'revenue_range': req.body.revenue_range
            }, (data) => {
                res.send(data);
            });
        }
        catch (e) {
            Logger.error(e);
        }
        console.log('===== FETCHING SEVERITY DATA TABLE END =====');
    }

    public getSeverityTimePeriodData(req: Request, res: Response, next: NextFunction) {
        console.log('===== FETCHING SEVERITY TIME PERIOD DATA START =====');
        try {
            super.PerformGetRequest("getSeverityTimePeriodData", {
                'ssnid': req.body.token,
                'company_id': req.body.companyId,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, (data) => {
                res.send(data);
            });
        }
        catch (e) {
            Logger.error(e);
        }
        console.log('===== FETCHING SEVERITY TIME PERIOD DATA END =====');
    }

    public getSeverityIndustryOverview(req: Request, res: Response, next: NextFunction) {
        try{
            super.PerformGetRequest("getIndustryOverviewDisplayDataset", {
                'companyId': req.body.companyId,
                'naics': req.body.naics,
                 'ssnid': req.body.token
                }, (data)=>{
                    res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }
}