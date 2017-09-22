import { Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class FrequencyRouter extends BaseRoute {

    constructor(private app: Application) {
        super();
        this.init();
    }

    public getFrequencyData(req: Request, res: Response, next: NextFunction) {
        try {
            console.log('TOKEN: ' + req.body.token);
            console.log('COMPANY ID: ' + req.body.company_id);
            console.log('INDUSTRY: ' + req.body.industry);
            console.log('REVENUE RANGE: ' + req.body.revenue_range);
            super.PerformGetRequest("getFrequencyData", {
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
    }

    public getFrequencyIndustryOverview(req: Request, res: Response, next: NextFunction) {
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

    //Initialize all the api call endpoints
    init() {
        this.app.post('/api/getFrequencyData', this.getFrequencyData);
        this.app.post('/api/getIndustryOverviewDisplayDataset', this.getFrequencyIndustryOverview);
    }
}