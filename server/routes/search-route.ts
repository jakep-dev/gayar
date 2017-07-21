import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class SearchRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    //Perform the company search based on searchtype and searchvalue
    //SearchType = COMP_NAME | COMP_ID | TICKER | DUNS
    public doCompanySearch(req: Request, res: Response, next: NextFunction){
        try{
            console.log(req.body.searchType);
            console.log(req.body.searchValue);
            super.PerformGetRequest("companySearch", {
                'ssnid': 'testtoken',
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

    //Get all available industries
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

    //Initialize all the api call endpoints
    init(){
       this.app.post('/api/doCompanySearch', this.doCompanySearch);
       this.app.post('/api/getIndustries', this.getIndustries);
    }
}

