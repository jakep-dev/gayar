import { Component, OnInit } from '@angular/core';
import { MenuService } from 'app/services/services';
import { environment } from 'environments/environment';
import { SessionService } from 'app/services/session.service';

@Component({
  selector: 'app-e-401',
  templateUrl: './e-401.component.html',
  styleUrls: ['./e-401.component.scss']
})
export class E401Component implements OnInit {

  constructor(private menuService: MenuService,
    private sessionService: SessionService) { }

  ngOnInit() {
    this.menuService.isFullScreen = true;
  }

  navigateToLogin () {
    const token: string = this.sessionService.Token;
    const loginUrl = `${environment.landingPage}/login/${token}`;
    window.location.replace(loginUrl);
  }
}
