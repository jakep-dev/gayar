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

        try {
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
        } catch(e) {

        }
        
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
                companySearch: SessionRouter.prototype.getCompanySearchPermission(componentPermission.list),
                dashboard: SessionRouter.prototype.getDashboardPermission(componentPermission.list),
                frequency: SessionRouter.prototype.getFrequencyPermission(componentPermission.list),
                severity: SessionRouter.prototype.getSeverityPermission(componentPermission.list),
                benchmark: SessionRouter.prototype.getBenchmarkPermission(componentPermission.list),
                glossary: SessionRouter.prototype.getGlossaryPermission(componentPermission.list),
                report: SessionRouter.prototype.getReportPermission(componentPermission.list)
            }
            userInfo.userinfo.permission = permission;
        }        
        return userInfo;
    }

    private getCompanySearchPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.COMPANY_SEARCH.PRODUCT_CODE, componentPermission),
        }
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

    private getFrequencyPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.PRODUCT_CODE, componentPermission),
            industry: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.INDUSTRY, componentPermission)
            },
            timePeriod: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.TIME_PERIOD, componentPermission),
                hasDetailAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.TIME_PERIOD_DETAIL, componentPermission),
            },
            incident: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.INCIDENT, componentPermission),
                hasDetailAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.INCIDENT_DETAIL, componentPermission),
            },
            loss : {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.LOSS, componentPermission),
                hasDetailAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.LOSS_DETAIL, componentPermission),
            },
            peerGroupTable: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.PEER_GROUP_TABLE, componentPermission),
                hasDescriptionAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.PEER_GROUP_TABLE_DESCR, componentPermission),
            }, 
            companyTable: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.COMPANY_TABLE, componentPermission),
                hasDescriptionAccess: SessionRouter.prototype.getAccess(ServerConstants.FREQUENCY.COMPONENTS_CODE.COMPANY_TABLE_DESCR, componentPermission),
            }
        }
    }

    private getSeverityPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.PRODUCT_CODE, componentPermission),
            industry: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.INDUSTRY, componentPermission)
            },
            timePeriod: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.TIME_PERIOD, componentPermission),
                hasDetailAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.TIME_PERIOD_DETAIL, componentPermission),
            },
            incident: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.INCIDENT, componentPermission),
                hasDetailAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.INCIDENT_DETAIL, componentPermission),
            },
            loss : {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.LOSS, componentPermission),
                hasDetailAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.LOSS_DETAIL, componentPermission),
            }, peerGroupTable: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.PEER_GROUP_TABLE, componentPermission),
                hasDescriptionAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.PEER_GROUP_TABLE_DESCR, componentPermission),
            }, companyTable: {
                hasAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.COMPANY_TABLE, componentPermission),
                hasDescriptionAccess: SessionRouter.prototype.getAccess(ServerConstants.SEVERITY.COMPONENTS_CODE.COMPANY_TABLE_DESCR, componentPermission),
            }
        }
    }
    
    private getBenchmarkPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.BENCHMARK.PRODUCT_CODE, componentPermission),
            limitAdequacy: {
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

    private getGlossaryPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.GLOSSARY.PRODUCT_CODE, componentPermission)
        }
    }

    private getReportPermission(componentPermission) {
        return {
            hasAccess: SessionRouter.prototype.getAccess(ServerConstants.REPORT.PRODUCT_CODE, componentPermission)
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
