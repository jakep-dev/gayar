import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class SearchRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    /**
     * Perform the company search based on searchtype and searchvalue
     * COMP_NAME | COMP_ID | TICKER | DUNS
     * @param req - Request details
     * @param res - Response details
     * @param next - Execute next functionalities
     */
    public doCompanySearch(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("companySearch", {
                'ssnid': req.body.token,
                'search_type': req.body.searchType,
                'search_value': req.body.searchValue
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }
    }

    /**
     * Get all available industries
     * @param req - Request details
     * @param res - Response details
     * @param next - Execute next functionality
     */
    public getIndustries(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("getIndustries", {
                'ssnid': req.body.token
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }   
    }

    /**
     * Check for revenue and industry
     * @param req - Request details
     * @param res - Response details
     * @param next - Execute next functionality
     */
    public checkForRevenueAndIndustry(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("checkForRevenueAndIndustry", {
                'ssnid': req.body.token,
                'company_id': req.body.companyId
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        } 
    }

    /**
     * Get the needed Range List
     * @param req - Request details
     * @param res - Response details
     * @param next - Execute next functionality
     */
    public getRangeList(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("revenueRangeList", {
                'ssnid': req.body.token
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }   
    }

    /**
     * Get the needed Range List
     * @param req - Request details
     * @param res - Response details
     * @param next - Execute next functionality
     */
    public checkValidationPeerGroupLoss(req: Request, res: Response, next: NextFunction){
        try{
            super.PerformGetRequest("checkValidationPeerGroupLoss", {
                'ssnid': req.body.token,
                'limit': req.body.limit,
                'retention': req.body.retention,
                'naics': req.body.naics,
                'company_id': req.body.company_id
            }, (data)=>{
                res.send(data);
            });
        }
        catch(e){
            Logger.error(e);
        }   
    }

    /**
     * Initialize all the api call endpoints
     */
    init(){
       this.app.post('/api/doCompanySearch', this.doCompanySearch);
       this.app.post('/api/getIndustries', this.getIndustries);
       this.app.post('/api/checkForRevenueAndIndustry', this.checkForRevenueAndIndustry);
       this.app.post('/api/getRangeList', this.getRangeList);
       this.app.post('/api/checkValidationPeerGroupLoss', this.checkValidationPeerGroupLoss);
    }
}

