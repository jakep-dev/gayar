import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../services/services';
import { SessionModel } from '../model/model';
import { MenuService } from 'app/services/services';
import { APPCONSTANTS } from 'app/app.const';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.scss']
})
export class SsoComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private sessionService: SessionService,
              private menuService: MenuService,
              private router: Router) { }

  ngOnInit() {
    this.menuService.isFullScreen = true;
    this.menuService.containerBgColor = "#000000";
    this.getCurrentIdentity();
  }

  /**
   * Get current identity from the server.
   */
  private getCurrentIdentity(){
      this.sessionService.removeAuth();
      let token: string  = this.route.snapshot.params['token'];
      if(token){
          this.sessionService.getCurrentIdentity(token, APPCONSTANTS.APPLICATION_ID).subscribe((res: SessionModel)=>{
            if(this.sessionService.isLoggedIn()){
              this.router.navigate(['/search']);
              }
              else{
                this.router.navigate(['/401']);
              }
          });
      }
      else{
        this.router.navigate(['/401']);
      }
  }
}
