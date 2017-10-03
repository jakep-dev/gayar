import { Component, OnInit } from '@angular/core';
import { MenuService, SessionService, SearchService } from 'app/services/services';
import { DOCUMENT } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  isFullScreen: boolean;
  searchCompanyName: string;
  showShortMenu: boolean = true;
  isMenuLock: boolean = false;
  sideNavMode: string = 'side';
  constructor(private menuService: MenuService,
              private searchService: SearchService,
              private sessionService: SessionService) {

  }

  ngOnInit() {
    this.sideNavMode = "side";
  }

  onMenu(name) {
    console.log('BreadCrumb - ',name);
    this.menuService.breadCrumb = name;
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

  /**
   * Validates whether there is a valid search criteria or not.  
   */
  isSearchCriteriaValid () : boolean {
    return this.searchService.hasValidSearchCriteria();
  }

  /**
   * Get the search company name
   * to display on the header.
   */
  getSearchCompanyName () : string {
    if(this.searchService.selectedCompany) {
      return this.searchService.selectedCompany.companyName;
    }

    if(this.searchService.searchCriteria) {
      return this.searchService.searchCriteria.value;
    }

    return null;
  }

  shortMenuMouseLeave(){
    if(!this.showShortMenu && !this.isMenuLock){
      this.showShortMenu = true;
      this.sideNavMode = "side";
    }
  }
}
