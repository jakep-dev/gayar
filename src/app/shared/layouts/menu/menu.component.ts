import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuService, SessionService, SearchService } from 'app/services/services';
import { DOCUMENT } from "@angular/platform-browser";
import { Observable } from 'rxjs/Observable';
import { environment } from 'environments/environment';
import 'rxjs/add/observable/of';
import { ValidationPeerGroupLossModel } from 'app/model/model';
import { Router } from '@angular/router';
import { PdfDownloadComponent } from 'app/pdf-download/pdf-download.component';

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

  @ViewChild(PdfDownloadComponent) 
  private pdfDownloader: PdfDownloadComponent;

  constructor(public menuService: MenuService,
              private searchService: SearchService,
              private sessionService: SessionService,
              private router: Router) {
        this.fullName = this.sessionService.UserFullName;
  }

  ngOnInit () {
    this.sideNavMode = NAV_MODE;
    this.watchForInprogress();
    setTimeout(this.setupPdfDownloader.bind(this), 0);
  }

  setupPdfDownloader() {
        this.menuService.setPdfDownloader(this.pdfDownloader);
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

  isDashboard(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.dashboard && permission.dashboard.hasAccess
  }

  isCompanySearch(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.companySearch && permission.companySearch.hasAccess
  }

  isFrequency(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.frequency && permission.frequency.hasAccess
  }

  isSeverity(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.severity && permission.severity.hasAccess
  }

  isBenchmark(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.benchmark && permission.benchmark.hasAccess
  }

  isReport(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.report && permission.report.hasAccess
  }

  isGlossary(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.glossary && permission.glossary.hasAccess
  }
  
  isUnderwritingFramework(): boolean {
    let permission = this.sessionService.getUserPermission();
    return permission && permission.underWritingFramework && permission.underWritingFramework.hasAccess;
  }

  /**
   * Validates whether there is a valid search criteria or not.
   * @return {boolean} - Is a valid search criteria or not.
   */
  public isSearchCriteriaValid () : boolean {
    if(this.searchService.hasValidSearchCriteria()) { 
      return true;
    } else {
      if(this.searchService && this.sessionService && this.searchService.hasValidSearchCriteria() && this.sessionService.isLoggedIn()) {
        setTimeout(this.setupPdfDownloader.bind(this), 0);
      }
      return false;
    }
  }

  /**
   * watchForInprogress - watch for the in progress http request.
   *
   * @return {type}  description
   */
  watchForInprogress () {
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
   * navigateGlossary - Navigate to the glossary page.
   *
   * @return {type} - No return type.
   */
  navigateGlossary (){
    if(this.isGlossary()) {
      this.onMenu('Glossary');
      this.router.navigate(['/glossary']);
    }
  }

  /**
   * launchUnderWriting - Launch the underwriting application.
   *
   * @return {type} - No return type.
   */
  launchUnderWriting () {
    if( this.isUnderwritingFramework() ) {
      const userId: number = this.sessionService.UserId;
      const token: string = this.sessionService.Token;
      const url = `${environment.underwritingUrl}/${userId}/${token}/true`;
      let winRef = window.open('', url, '', true);
      if (winRef.location.href === 'about:blank'){
          winRef.location.href = url;
      }
      winRef.location.href = url;
     }
  }

  shortMenuMouseLeave () {
    if(!this.showShortMenu && !this.isMenuLock){
      this.showShortMenu = true;
      this.sideNavMode = NAV_MODE;
    }
  }
}
