import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from '../services/services';
import { SessionModel } from '../model/model';
@Component({
  selector: 'app-sso',
  templateUrl: './sso.component.html',
  styleUrls: ['./sso.component.css']
})
export class SsoComponent implements OnInit {

  constructor(private route: ActivatedRoute, private sessionService: SessionService) { }

  ngOnInit() {
    this.getCurrentIdentity();
  }

  private getCurrentIdentity(){
      let userId: string  = this.route.snapshot.params['userId'];
      if(userId){
          this.sessionService.getCurrentIdentity(userId).subscribe((res: SessionModel)=>{
              if(this.sessionService.isLoggedIn().take(1)){
                console.log('Authenticated');
                console.log(res);
              }
              else{
                console.log('UnAuthenticated');
              }
          });
      }
  }
}
