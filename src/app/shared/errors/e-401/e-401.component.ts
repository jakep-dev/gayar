import { Component, OnInit } from '@angular/core';
import { MenuService } from 'app/services/services';

@Component({
  selector: 'app-e-401',
  templateUrl: './e-401.component.html',
  styleUrls: ['./e-401.component.css']
})
export class E401Component implements OnInit {

  constructor(private menuService: MenuService) { }

  ngOnInit() {
    this.menuService.isFullScreen = true;
  }

}
