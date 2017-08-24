import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';

export class SessionRouter extends BaseRoute {
    
    constructor(private app: Application){
        super();
        this.init();
    }

    //Get active session
    public getCurrentIdentity(req: Request, res: Response, next: NextFunction){
        try{
            console.log(req.body.userId);
            super.PerformGetRequest("getActiveSession", {
                'user_id': req.body.userId
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
       this.app.post('/api/getCurrentIdentity', this.getCurrentIdentity);
    }
}

