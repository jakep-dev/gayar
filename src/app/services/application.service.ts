import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BaseServiceClient } from 'app/services/base.service.client';


@Injectable()
export class ApplicationService extends BaseServiceClient {
    constructor(http: HttpClient){
        super(http);
    }

    public getGlossary() : Observable<any>{
        try{
          return super.Post<any>('/api/getGlossary', {});
        }catch(e){

        }
    }

}