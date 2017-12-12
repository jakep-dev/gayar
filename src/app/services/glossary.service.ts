import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class GlossaryService extends BaseService {
    constructor(http: Http){
        super(http);
    }

    public getGlossary() : Observable<any>{
        try{
          return super.Post<any>('/api/getGlossary', {});
        }catch(e){

        }
    }

}