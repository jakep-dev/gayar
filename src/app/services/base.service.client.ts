import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SessionModel } from 'app/model/session.model';
import 'rxjs/add/operator/retry';

export abstract class BaseServiceClient {
    public currentIdentity: SessionModel;
    
    constructor(private http: HttpClient){
    }

    /**
     * Get 
     * 
     * @param endPoint 
     * @param data 
     */
    public Get<T>(endPoint: string, data: any, respType: any = 'json'): Observable<T> {
      return this.http.get<T>(endPoint, {observe: 'response', 
                              responseType: respType})
                 .retry(2)
                 .map((res: HttpResponse<T>) => {
                   return res.body as T;
                 });
    }
    
    /**
     * 
     * @param endPoint 
     * @param data 
     */
    public Post<T>(endPoint: string, data: any): Observable<T> {
      return this.http.post<T>(endPoint, data, { 
        observe: 'response',
        responseType: 'json'
      }).retry(2)
        .map((res: HttpResponse<T>) => {
          return res.body as T;
        });
    }

    private handleException(error: Response | any){
      let errMsg: string;
      if (error instanceof Response) {
          const body = error.json() || '';
          const err = JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
      } else {
          errMsg = error.message ? error.message : error.toString();
      }
      console.error(errMsg);
      return Observable.throw(errMsg);
  }
}
