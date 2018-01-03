import { Component, OnInit } from '@angular/core';
import { MenuService } from 'app/services/services';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-e-401',
  templateUrl: './e-401.component.html',
  styleUrls: ['./e-401.component.scss']
})
export class E401Component implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.isFullScreen = true;
  }

  navigateToLogin () {
    const loginUrl: string = environment.landingPage;
    let winRef = window.open('', loginUrl, '', true);
    if (winRef.location.href === 'about:blank'){
      winRef.location.href = loginUrl;
   }
   winRef.location.href = loginUrl;
  }
}
