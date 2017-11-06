import { Component, OnInit } from '@angular/core';
import { MenuService, SessionService, SearchService } from 'app/services/services';
import { DOCUMENT } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import 'rxjs/add/observable/of';
import { ValidationPeerGroupLossModel } from 'app/model/model';

const NAV_MODE = 'side';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  isLoading: boolean;
  isFullScreen: boolean;
  searchCompanyName: string;
  showShortMenu: boolean = true;
  isMenuLock: boolean = false;
  sideNavMode: string = NAV_MODE;
  fullName: string;
  constructor(private menuService: MenuService,
              private searchService: SearchService,
              private sessionService: SessionService) {
        this.fullName = this.sessionService.UserFullName;
  }

  ngOnInit () {
    this.sideNavMode = NAV_MODE;
    this.watchForInprogress();
  }

  onMenu (name) {
    this.menuService.breadCrumb = name;
  }


  /**
   * toggleMenu - toggle the menu details.
   *
   * @return {void}  - No return type.
   */
  toggleMenu(){
    this.showShortMenu = !this.showShortMenu;
    this.isMenuLock = !this.isMenuLock;
  }


  /**
   * shortMenuMouseOver - shows the shorter menu over main menu
   *
   * @return {void}  - No return type
   */
  shortMenuMouseOver () {
    this.sideNavMode = NAV_MODE;
    if(this.sideNavMode){
      this.showShortMenu = false;
    }
  }


  /**
   * Validates whether there is a valid search criteria or not.
   * @return {boolean} - Is a valid search criteria or not.
   */
  isSearchCriteriaValid () : boolean {
    return this.searchService.hasValidSearchCriteria();
  }

  /**
   * watchForInprogress - watch for the in progress http request.
   *
   * @return {type}  description
   */
  watchForInprogress () {
    this.searchService.isHttpReqInProgress().asObservable().subscribe(res=> {

    });
  }

  /**
   * Get the search company name
   * to display on the header.
   * @return {string} - company name.
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


  /**
   * navigateToHome - Navigate to the home tab.
   *
   * @return {type} - No return type.
   */
  navigateToHome () {

  }

  /**
   * launchUnderWriting - Launch the underwriting application.
   *
   * @return {type} - No return type.
   */
  launchUnderWriting () {
     const userId: number = this.sessionService.UserId;
     const token: string = this.sessionService.Token;
     const url = `${environment.underwritingUrl}/${userId}/${token}/true`;
     let winRef = window.open('', url, '', true);
     if (winRef.location.href === 'about:blank'){
        winRef.location.href = url;
     }
     winRef.location.href = url;
  }

  shortMenuMouseLeave () {
    if(!this.showShortMenu && !this.isMenuLock){
      this.showShortMenu = true;
      this.sideNavMode = NAV_MODE;
    }
  }
}
