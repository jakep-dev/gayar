import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/catch';

export abstract class BaseService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http){

    }
    
    //Perform the post request operation
    public Post<T>(endPoint: string, data: any): Observable<T>{
       return this.http.post(endPoint, data, this.headers)
                 .map((res: Response)=>{
                     return res.json() as T
                 })
                 .catch(this.handleException);
    }

    //Perform the get request operation
    public Get<T>(endPoint: string, data: any): Observable<T>{
        let dataString:string = JSON.stringify(data),
             path = `${endPoint}?${JSON.stringify(data)}`;
             
       return this.http.get(path, this.headers)
                 .map((res: Response)=>{
                     return res.json() as T
                 })
                 .catch(this.handleException);
    }

    public Put<T>(endPoint: string, data: any): Observable<T>{
       return this.http.put(endPoint, JSON.stringify(data), this.headers)
                 .map((res: Response)=>{
                     return res.json() as T
                 })
                 .catch(this.handleException);
    }

    public Delete<T>(endPoint: string, data: any): Observable<T>{
        let path = `${endPoint}/${data}`;
        return this.http.delete(path, this.headers)
                 .map((res: Response)=>{
                     return res.json() as T
                 })
                 .catch(this.handleException);
    }

    private handleException(error: Response | any): any{
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}