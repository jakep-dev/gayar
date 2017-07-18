import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  private breadCrumbName: string;
  private searchCompanyName: string;
  constructor() { }

  ngOnInit() {
    this.breadCrumbName = "Dashboard";
  }

  onMenu(name) {
    this.breadCrumbName = name;
  }

}
