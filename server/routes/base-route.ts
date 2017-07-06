import * as https from 'https';
import * as querystring from 'querystring';
import { EnvConfig } from '../env.config';
import { ApiModel } from '../model/env.model'
import { Logger } from '../helpers/helpers';
 
export abstract class BaseRoute {
    static apiModel: ApiModel;
    constructor(){
        BaseRoute.apiModel = EnvConfig.getApi();
    }
    
     PerformGetRequest(endpoint:string, data:any, success:any): void {
         let dataString:string = JSON.stringify(data);
         let headers = {
             'Content-Type': 'application/json',
             'Content-Length': dataString.length
         };
         endpoint += '?' + querystring.stringify(data);

         let options = {
             host: BaseRoute.apiModel.host, //"wsint.advisen.com",
             path: endpoint,
             method: 'GET',
             headers: headers
         };

        //throw new Error("Index Out of Bounds");
         let req = https.request(options, function(res){
                res.setEncoding('utf-8');
                let responseString: string = '';

                res.on('data', function(data) {
                    responseString += data;
                });

                res.on('end', function() {
                    let responseObject:JSON = JSON.parse(responseString);
                    success(responseObject);
                });
         });

         req.write(dataString);
         req.end();
     }

     PerformPostRequest(): void{

     }
}





  