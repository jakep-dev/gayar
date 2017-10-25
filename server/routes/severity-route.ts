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
        this.app.post('/api/getSeverityTypeOfLossFlipDetailDataset', this.getSeverityTypeOfLossFlipDetailDataset);
        this.app.post('/api/getSeverityTypeOfIncidentFlipDetailDataset', this.getSeverityTypeOfIncidentFlipDetailDataset);
        this.app.post('/api/getSeverityTypeOfIncidentBarData', this.getSeverityTypeOfIncidentBarData);
        this.app.post('/api/getSeverityTypeOfLossBarData', this.getSeverityTypeOfLossBarData);
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
        try {
            super.PerformGetRequest("getIndustryOverviewDisplayDataset", {
                'companyId': req.body.companyId,
                'naics': req.body.naics,
                'ssnid': req.body.token
            }, (data) => {
                res.send(data);
            });
        }
        catch (e) {
            Logger.error(e);
        }
    }

    //Get Loss flip pie chart details
    public getSeverityTypeOfLossFlipDetailDataset(req: Request, res: Response, next: NextFunction) {
        try {
            super.PerformGetRequest("getSeverityTypeOfLossFlipDetailDataset", {
                'ssnid': req.body.token,
                'company_id': req.body.company_id,
                'naics': req.body.naics,
                'revenue_range': req.body.revenue_range,
            }, (data) => {
                res.send(data);
            });
        }
        catch (e) {
            Logger.error(e);
        }
    }

    //Get Incident flip pie chart details
    public getSeverityTypeOfIncidentFlipDetailDataset(req: Request, res: Response, next: NextFunction) {
        try {
            super.PerformGetRequest("getSeverityTypeOfIncidentFlipDetailDataset", {
                'ssnid': req.body.token,
                'company_id': req.body.company_id,
                'naics': req.body.naics,
                'revenue_range': req.body.revenue_range,
            }, (data) => {
                res.send(data);
            });
        }
        catch (e) {
            Logger.error(e);
        }
    }
    //Get Type of Incident Bar
    public getSeverityTypeOfIncidentBarData(req: Request, res: Response, next: NextFunction) {
        console.log('===== FETCHING SEVERITY INCIDENT BAR DATA START =====');
        try {
            super.PerformGetRequest("getSeverityTypeOfIncidentBarData", {
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
        console.log('===== FETCHING SEVERITY INCIDENT BAR DATA END =====');
    }
                     
    //Get Type of Loss Bar
    public getSeverityTypeOfLossBarData(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getSeverityTypeOfLossBarData", {
                'ssnid': req.body.token,
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
}