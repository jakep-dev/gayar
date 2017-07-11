import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';

export default class SearchRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    //Perform the company search based on searchtype and searchvalue
    //SearchType = COMP_NAME | COMP_ID | TICKER | DUNS
    public doCompanySearch(req: Request, res: Response, next: NextFunction){
        super.PerformGetRequest("companySearch", {
           'ssnid': req.body.token,
           'search_type': req.body.searchType,
           'search_value': req.body.searchValue
       }, (data)=>{
           res.send(data);
       });
    }

    //Get all available industries
    public getIndustries(req: Request, res: Response, next: NextFunction){
        super.PerformGetRequest("getIndustries", {
           'ssnid': req.body.token
       }, (data)=>{
           res.send(data);
       });
    }

    init(){
       this.app.post('/api/doCompanySearch', this.doCompanySearch);
       this.app.post('/api/getIndustries', this.getIndustries);
    }
}

