import { Injectable } from '@angular/core'
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router'
import { SessionService } from './session.service'
import { MenuService } from './menu.service'
import 'rxjs/add/operator/take'
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthRouteActivatorService implements CanActivate {

    constructor(private sessionService: SessionService,
                private menuService: MenuService,
                private router: Router) {

    }

    /**
     * Secures the route by checking the logged in user.
     * @param route - current active route.
     * @param state - current state of the route.
     */
     canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : boolean {
        if(this.sessionService.isLoggedIn()){
            this.menuService.isFullScreen = false;
            this.menuService.containerBgColor ="#fafafa"; 
            this.sessionService.restoreIdentity();
            return true;
        }
        else{
            this.sessionService.removeAuth();
            this.menuService.isFullScreen = true;
            this.router.navigate(['/401']);
            return false;
        }
    }

    
}