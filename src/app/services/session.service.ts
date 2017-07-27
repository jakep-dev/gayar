import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/do'
import { SessionModel, SessionResponseModel } from 'app/model/model';


@Injectable()
export class SessionService extends BaseService {
    private currentIdentity: SessionModel;
    private isLogin = new BehaviorSubject<boolean>(this.hasToken());

    constructor(http: Http) {
        super(http);
    }

    public getCurrentIdentity(userId: string): Observable<SessionModel> {
        try{
           return super.Post<SessionResponseModel>('/api/getCurrentIdentity', {
               'userId': userId
           }).map((res: SessionResponseModel)=>{
               this.currentIdentity = res.userinfo;
               this.setAuth();
               return this.currentIdentity;
           });
        }
        catch(e){

        }
    }

    public getUserFullName(): string {
        return this.currentIdentity.fullName;
    }

    public isLoggedIn(): Observable<boolean> {
        return this.isLogin.asObservable().share();
    }

    private setAuth(){
        localStorage.setItem("identity", JSON.stringify(this.currentIdentity));
        this.isLogin.next(true);
    }

    private hasToken(){
        return !!localStorage.getItem("identity");
    }
}