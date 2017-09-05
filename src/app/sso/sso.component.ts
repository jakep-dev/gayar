import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../services/services';
import { SessionModel } from '../model/model';
import { MenuService } from 'app/services/services';

@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.css']
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
      let userId: string  = this.route.snapshot.params['userId'];
      if(userId){
          this.sessionService.getCurrentIdentity(userId).subscribe((res: SessionModel)=>{
            if(this.sessionService.isLoggedIn()){
              this.router.navigate(['/search']);    
              }
              else{
                this.router.navigate(['/401']);
              }
          });
      }
  }
}
