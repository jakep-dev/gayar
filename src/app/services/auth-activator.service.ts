import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { SessionService } from './session.service'
import 'rxjs/add/operator/take'
import { Observable } from 'rxjs/Observable';

export class AuthRouteActivatorService implements CanActivate {
   
    constructor(private sessionService: SessionService) {

    }

     canActivate(route: ActivatedRouteSnapshot): Observable<boolean>  {
         return this.sessionService.isLoggedIn().take(1);
    }
}