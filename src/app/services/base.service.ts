import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers, RequestOptionsArgs, ResponseContentType } from '@angular/http';
import { SessionModel } from 'app/model/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

export abstract class BaseService {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});
    private requestOptions: RequestOptionsArgs = { headers: this.headers };
    public currentIdentity: SessionModel;
    private isHttpRequestInProgress: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor (private http: Http) {
    }

    //Perform the post request operation
    public Post<T>(endPoint: string, data: any): Observable<T>{
        if(!this.currentIdentity){
            this.getToken();
        }
       this.handleRequestProgress();
       data.token = this.currentIdentity ? this.currentIdentity.token || null : null;
       return this.http.post(endPoint, data, this.requestOptions)
                 .map((res: Response)=>{
                     this.isHttpRequestInProgress.next(false);
                     return res.json() as T
                 })
                 .catch(this.handleException)
                 .finally(this.handleFinally);
    }

    //Perform the get request operation
    public Get<T>(endPoint: string, data: any): Observable<T>{
        let dataString: string;
        let path: string;
        if(data != null) {
            dataString = JSON.stringify(data);
            path = endPoint + '?' + dataString
        } else {
            path = endPoint;
        }
        return this.http.get(path, this.requestOptions)
                 .map((res: Response)=>{
                     this.isHttpRequestInProgress.next(false);
                     return res.json() as T;
                 })
                 .catch(this.handleException)
                 .finally(this.handleFinally);
    }

    public GetFile<T>(endPoint: string, data: any): Observable<Blob>{
        let dataString: string;
        let path: string;
        if(data != null) {
            dataString = JSON.stringify(data);
            path = endPoint + '?' + dataString
        } else {
            path = endPoint;
        }
        return this.http.get(path, { responseType: ResponseContentType.Blob })
                 .map((res: Response)=>{
                     this.isHttpRequestInProgress.next(false);
                     return res.blob();
                 })
                 .catch(this.handleException)
                 .finally(this.handleFinally);
    }

    public Put<T>(endPoint: string, data: any): Observable<T>{
        this.isHttpRequestInProgress.next(true);
        return this.http.put(endPoint, JSON.stringify(data), this.requestOptions)
                 .map((res: Response)=>{
                     return res.json() as T;
                 })
                 .catch(this.handleException)
                 .finally(this.handleFinally);
    }

    public Delete<T>(endPoint: string, data: any): Observable<T>{
        let path = `${endPoint}/${data}`;
        return this.http.delete(path, this.requestOptions)
                 .map((res: Response)=>{
                     return res.json() as T
                 })
                 .catch(this.handleException)
                 .finally(this.handleFinally);
    }

    private handleException(error: Response | any){
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

    private handleFinally () {

    }

    private handleRequestProgress () {
      this.isHttpRequestInProgress.next(true);
    }

    private getToken(){
        if(!this.currentIdentity){
            let identity: string = localStorage.getItem("identity");
            if(identity && identity.trim() !== ''){
                this.currentIdentity = JSON.parse(identity) as SessionModel;
            }
        }
    }
}
