import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/do'
import { SessionModel, SessionResponseModel } from 'app/model/model';
import { BaseServiceClient } from 'app/services/base.service.client';


@Injectable()
export class SessionService extends BaseService {
    private isLogin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.hasToken());
    constructor(http: Http) {
        super(http);
    }

    public getCurrentIdentity(token: string, applicationId: string): Observable<SessionModel> {
        try {
           return super.Post<SessionResponseModel>('/api/getCurrentIdentity', {
               'token': token,
               'productCode': applicationId
           }).map((res: SessionResponseModel)=>{
               this.currentIdentity = res.userinfo;
               if(this.currentIdentity && this.currentIdentity.token){
                this.setAuth();
               }
               return this.currentIdentity;
           });
        }
        catch(e){

        }
    }


    /**
     * public get - Get the UserId from currentIdentity.
     *
     * @return {type} number - UserId
     */
    public get UserId () : number {
      return this.currentIdentity.userId;
    }


    /**
     * public get - Get the token from currentIdentity.
     *
     * @return {type} string - Token
     */
    public get Token () : string {
      return this.currentIdentity.token;
    }


    /**
     * public get - Get the fullname from currentIdentity.
     *
     * @return {type} string - FullName
     */
    public get UserFullName () : string {
      return this.currentIdentity ? this.currentIdentity.fullName : '';
    }

    public getUserFullName(): string {
        return this.currentIdentity.fullName;
    }

    public restoreIdentity() {
        if(!this.currentIdentity){
            let identity: string = localStorage.getItem("identity");
            if(identity && identity.trim() !== ''){
                this.currentIdentity = JSON.parse(identity) as SessionModel;
            }
        }
    }

    public removeAuth(){
        this.currentIdentity = null;
        localStorage.removeItem("identity");
    }

    public isLoggedIn(): boolean {
        return this.isLogin.value;
    }

    public getUserPermission () {
      if( this.currentIdentity && this.currentIdentity.permission) {
          return this.currentIdentity.permission
      }
      return null;
    }

    public getDashboardPermission () {
      return this.currentIdentity.permission.dashboard;
    }

    private setAuth(){
        localStorage.setItem("identity", JSON.stringify(this.currentIdentity));
        this.isLogin.next(true);
    }

    private hasToken(){
        return !!localStorage.getItem("identity");
    }
}
