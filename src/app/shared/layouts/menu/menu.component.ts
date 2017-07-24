import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  private breadCrumbName: string;
  private searchCompanyName: string;
  private showShortMenu: boolean = true;
  private isMenuLock: boolean = false;
  private sideNavMode: string = 'side';
  constructor() { }

  ngOnInit() {
    this.breadCrumbName = "Dashboard";
    this.sideNavMode = "side";
  }

  onMenu(name) {
    this.breadCrumbName = name;
  }

  toggleMenu(){
    this.showShortMenu = !this.showShortMenu;
    this.isMenuLock = !this.isMenuLock;
  }

  shortMenuMouseOver(){
    this.sideNavMode = "side";
    if(this.sideNavMode){
      this.showShortMenu = false;
    }
  }

  shortMenuMouseLeave(){
    if(!this.showShortMenu && !this.isMenuLock){
      this.showShortMenu = true;
      this.sideNavMode = "side";
    }
  }
}
