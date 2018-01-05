import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from 'app/services/services';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-e-500',
  templateUrl: './e-500.component.html',
  styleUrls: ['./e-500.component.scss']
})
export class E500Component implements OnInit {
 
  constructor(private menuService: MenuService,
              private router: Router) { }

  ngOnInit() {
    this.menuService.isFullScreen = true;
  }

  onNavigate (routeName) {
    if (routeName === 'login') {
      const loginUrl: string = environment.landingPage;
      let winRef = window.open('', loginUrl, '', true);
      if (winRef.location.href === 'about:blank'){
        winRef.location.href = loginUrl;
      }
      winRef.location.href = loginUrl;
      return;
    }

    this.router.navigate([`/${routeName}`]);
    
  }
}
