import * as https from 'https';
import * as http from 'http';
import * as querystring from 'querystring';
import { EnvConfig } from '../env.config';
import { ApiModel } from '../model/env.model'
import { Logger } from '../helpers/helpers';
 
export abstract class BaseRoute {
    static apiModel: ApiModel;
    constructor(){
        BaseRoute.apiModel = EnvConfig.getApi();
    }
    
     //Perform get request operation based on https or http
     PerformGetRequest(endpoint:string, data:any, success:any): void {
         let dataString:string = JSON.stringify(data),
             path = `${EnvConfig.getContractByName(endpoint)}?${querystring.stringify(data)}`,
             headers = {
                'Content-Type': 'application/json',
                'Content-Length': dataString.length
            },
             options = {
                host: BaseRoute.apiModel.host, 
                path: path,
                method: 'GET',
                port: BaseRoute.apiModel.port
            };
            
         let handler: any = BaseRoute.apiModel.protocol === 'https' ? https: http;   
         let req = handler.request(options, function(res){
                res.setEncoding('utf-8');
                let responseString: string = '';

                res.on('data', function(data) {
                    responseString += data;
                });

                res.on('end', function() {
                    let responseObject:JSON = JSON.parse(responseString);
                    success(responseObject);
                });

                req.on('error', (e) => {
                    Logger.error(e);
                });
         });
         req.write(dataString);
         req.end();
     }

     //Perform post request operation based on https or http
     PerformPostRequest(endpoint:string, data:any, success:any): void{
         let postData = querystring.stringify(data),
             path = `${EnvConfig.getContractByName(endpoint)}?${querystring.stringify(data)}`,
             headers = {
                'Content-Type': 'application/json',
                'Content-Length': postData.length
            },
             options = {
             host: BaseRoute.apiModel.host,
             path: path,
             method: 'POST',
             headers: headers,
             port: BaseRoute.apiModel.port
            };

         let handler: any = BaseRoute.apiModel.protocol === 'https' ? https: http;
         let req = handler.request(options, function(res){
                res.setEncoding('utf-8');
                let responseString: string = '';

                res.on('data', function(data) {
                    responseString += data;
                });

                res.on('end', function() {
                    let responseObject:JSON = JSON.parse(responseString);
                    success(responseObject, res);
                });

                req.on('error', (e) => {
                    Logger.error(e);
                });
         });
        
         req.write(postData);
         req.end();
     }
}





  