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

      //Implement the waterfall here.
      // Get the Active Session. and call getPermissions only when we have an active token.
      // If token is null we don't need to call the getPermissions, otherwise call.
      //
      // GetPremission
      /*
      Parameters:
      user_id: req.body
      product_id: req.body
      ssnid: first function call output. i.e token.


      Third Function;- will be contact the userInfo + Permission.

      {
          code:,
          name:,
          access:,
          no_access_display_type:
      }

      Menu -
      a. CompanySearch, - companySearchPermission()
          i. searchCompany.
          ii. programStructure.
      b. Dashboard - dashboardPermission()
      c. Frequency. - private frequencyPermission()

      companySearch: {
      hasAccess: true,
      displayType: ''

          searchCompany: {
          hasAccess: true,

        }
    }

      */
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

    private performUserPermission () {

    }

    public getUserPermissionForComponents (req: Request, res: Response, next: NextFunction) {
      return  {

      }
    }

    //Initialize all the api call endpoints
    init(){
       this.app.post('/api/getCurrentIdentity', this.getCurrentIdentity);
    }
}
