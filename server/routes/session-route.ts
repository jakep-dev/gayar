import {  Request, Response, NextFunction, Application } from 'express';
import { BaseRoute } from './base-route';
import { Logger } from '../helpers/helpers';
import { ServerConstants } from '../const'
import * as async from 'async';
import waterfall from 'async/waterfall';

export class SessionRouter extends BaseRoute {

    constructor(private app: Application){
        super();
        this.init();
    }

    //Get active session
    public getCurrentIdentity(req: Request, res: Response, next: NextFunction){

        async.waterfall([
            function(callback) {
                SessionRouter.prototype.getUserDetails(req.body.userId, callback);
            },
            function (userInfo, callback) {
                if( userInfo && 
                    userInfo.userinfo && 
                    userInfo.userinfo.token) {
                        SessionRouter.prototype.getUserPermissionForComponents(userInfo, req.body.productCode, callback);
                } else {
                    res.send(userInfo);
                }                
            },
            function (userInfo, componentPermissions, callback) {
                res.send(SessionRouter.prototype.performUserPermission(userInfo, componentPermissions));
            }
        ], function (err, result) {
            res.send(err);
        });

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
        // try{
        //     console.log(req.body.userId);
        //     super.PerformGetRequest("getActiveSession", {
        //         'user_id': req.body.userId
        //     }, (data)=>{
        //         res.send(data);
        //     });
        // }
        // catch(e){
        //     Logger.error(e);
        // }
    }

    private getUserDetails (userId: number, callback: any) {
        
        super.PerformGetRequest("getActiveSession", {
            'user_id': userId
        }, (data)=>{
            callback(null, data);
        });
    }

    public getUserPermissionForComponents (arg: any, productCode: string, callback: any) {
        super.PerformGetRequest("getPermissions", {
            'user_id': arg.userinfo.userId,
            'product_code': productCode,
            'ssnid': arg.userinfo.token
        }, (data)=>{
            callback(null, arg, data);
        });
    }

    private performUserPermission (userInfo, componentPermission) {
        if( componentPermission && componentPermission.list) {
            let permission = {
                companySearch: {},
                dashboard: SessionRouter.prototype.getDashboardPermission(componentPermission.list),
                frequency: {},
                benchmark: SessionRouter.prototype.getBenchmarkPermission(componentPermission.list)
            }
            userInfo.userinfo.permission = permission;
        }        
        return userInfo;
    }

    private getDashboardPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.DASHBOARD.PRODUCT_CODE, componentPermission),
            frequencyGauge: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.DASHBOARD.COMPONENTS_CODE.FREQUENCY, componentPermission)
            },
            severityGauge: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.DASHBOARD.COMPONENTS_CODE.SEVERITY, componentPermission)
            },
            benchmarkGauge: {
                hasAccess:SessionRouter.prototype.getAccess(ServerConstants.DASHBOARD.COMPONENTS_CODE.BENCHMARK, componentPermission)
            }
        }
    }
    
    private getBenchmarkPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.PRODUCT_CODE, componentPermission),
            limit_adequacy: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.COMPONENTS_CODE.LIMIT_ADEQUACY, componentPermission)
            },
            premium: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.COMPONENTS_CODE.PREMIUM, componentPermission)
            },
            limit: {
                hasAccess:SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.COMPONENTS_CODE.LIMIT, componentPermission)
            },
            retention: {
                hasAccess:SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.COMPONENTS_CODE.RETENTION, componentPermission)
            },
            rate: {
                hasAccess:SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.COMPONENTS_CODE.RATE, componentPermission)
            }
        }
    }

    private getAccess(componentCode: any, componentPermission: any): boolean {
        
        let product = componentPermission.find( component => { return component.code === componentCode});
        return (product && product.access && product.access === 'Y') || false;
    }

    //Initialize all the api call endpoints
    init(){
       this.app.post('/api/getCurrentIdentity', this.getCurrentIdentity);
    }
}
