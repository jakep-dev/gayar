import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';

export default class BenchmarkRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    //Get the chart data by companyId
    public getChartDataByCompanyId(req: Request, res: Response, next: NextFunction) {
            super.PerformGetRequest("getDistributionDataSet", {
                'client_value': req.body.clientValue,
                'chart_type': req.body.chartType,
                'company_id': req.body.companyId
            }, (data)=>{
                res.send(data);
            });
    }

    //Get the chart data by manual input
    public getChartDataByManualInput(req: Request, res: Response, next: NextFunction) {
            super.PerformGetRequest("getDistributionDataSet", {
                'client_value': req.body.clientValue,
                'naics': req.body.naics,
                'revenue_range': req.body.revenueRange
            }, (data)=>{
                res.send(data);
            });
    }
    
    init(){
       this.app.post('/api/getChartDataByCompanyId', this.getChartDataByCompanyId);
       this.app.post('/api/getChartDataByManualInput', this.getChartDataByManualInput);
    }
}

