import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SessionService, MenuService } from 'app/services/services';
import { SearchByModel, SearchModel, CompanyModel, IndustryModel, IndustryResponseModel, RevenueRangeResponseModel, SearchCriteriaModel, RevenueModel, ValidationPeerGroupLossModel } from 'app/model/model';
import { KmbConversionPipe, CommaConversionPipe } from 'app/shared/pipes/pipes';
import { BehaviorSubject  } from 'rxjs/BehaviorSubject';
import { AsyncSubject  } from 'rxjs/AsyncSubject';
import { Observable  } from 'rxjs/Observable';
import { SnackBarService } from 'app/shared/shared';
import 'rxjs/add/observable/forkJoin';

/**
 * All constants related to search screen goes here.
 */
const SEARCHCRITERIA_CHANGED = "Please click on Assessment/Report to rerun the analysis as changes were made to the search criteria.";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  selectedSearchBy: number = 4;
  selectedSearchType: string;
  selectedSearchValue: string;
  isTriggerSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  hasSearchResult: boolean = false;
  searchRule: string = "number";
  searchValuePlaceHolder: string;
  selectedIndustry: IndustryModel;
  selectedPremium: string;
  selectedRetention: string;
  selectedLimit: string;
  pageId: string;
  selectedRevenue: RevenueModel;
  selectedCompanyModel: CompanyModel = null;
  loadedCompanyModel: CompanyModel = null;
  enteredSearchFilter: string;
  isManual: boolean;
  isSearching: boolean;
  isActionEnabled:boolean;
  hasFrequencyData: boolean;
  hasSeverityData: boolean;
  searchByList: Array<SearchByModel>;
  industryList: Array<IndustryModel>;
  revenueModellist: Array<RevenueModel>;

  /**
   *
   */
  constructor(private searchService: SearchService,
              private menuService: MenuService,
              private sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService) {

  }

  /**
   * ngOnInit - Fires on initial load and loads the
   * SearchBy, Industry, Revenue and previously loaded searchCriteria
   * @return {type}  description
   */
  ngOnInit() {
     this.menuService.breadCrumb = 'Company Search';
     this.checkPermission();
     this.loadSearchBy();
     this.loadIndustry();
     this.loadRevenueModel();
     this.loadSearchCriteria();
  }

  checkPermission() {
    let permission = this.sessionService.getUserPermission();
    if(permission && permission.companySearch && (!permission.companySearch.hasAccess)) {
      this.router.navigate(['/403']);
    }
  }


  /**
   * calcPlaceHolderForSearchValue - Sets the searchRule, searchType, isManual and searchValuePlaceHolder.
   *
   * @return {type}  No return type
   */
  calcPlaceHolderForSearchValue(){
    let searchByModel: SearchByModel =  this.searchByList.find(f=>f.id === this.selectedSearchBy);
    if(!searchByModel) { return; }
    this.searchRule             = searchByModel.rule;
    this.selectedSearchType     = searchByModel.type;
    this.isManual               = (searchByModel.type === "SEARCH_BY_MANUAL_INPUT")
    this.hasSearchResult        = !this.isManual;
    this.searchValuePlaceHolder = this.isManual ? 'Enter Company Name' : `Enter ${searchByModel.description}`;
  }

  /**
   * clearSearchCriteria - Clears the previously selected search criteria.
   * Displays message to user about the search update.
   * Removes the search selection from session.
   * @return {type}  No return Type
   */
  clearSearchCriteria () {
    if (this.searchService.searchCriteria ||
        this.searchService.selectedCompany) {
        this.searchService.clearSearchCookies();
        this.snackBarService.Simple(SEARCHCRITERIA_CHANGED);
    }
    this.loadedCompanyModel   = null;
    this.selectedCompanyModel = null;
  }

  /**
   * validateRevenueAndIndustry - Checks for revenue and industry for the selected company.
   * If selected company doesn't have renenue and industry displays proper message to the user.
   * @return {type}  No return type
   */
  validateRevenueAndIndustry () {
    const selectedCompany = this.selectedCompanyModel;
    this.searchService.checkForRevenueAndIndustry(selectedCompany.companyId).subscribe((data)=>{
        if(data && data.message){
          this.snackBarService.Simple(data.message);
        }else{
          this.setSelectedSearchCriteria();
          this.router.navigate(['/dashboard']);
        }
    });
  }

  /**
   * setSelectedSearchCriteria - Sets the selected search criteria and selected company.
   * Converts the limit, premium and retention and sets the search criteria.
   * Search Type - is not manual, sets the selected company as well.
   * @return {type}  description
   */
  setSelectedSearchCriteria () {
    let revenueModel: RevenueModel;
    let limit = new KmbConversionPipe().transform(this.selectedLimit);
    let premium = new KmbConversionPipe().transform(this.selectedPremium);
    let retention = new KmbConversionPipe().transform(this.selectedRetention);

    if(!this.isManual){
      this.searchService.selectedCompany = this.selectedCompanyModel;
      revenueModel = this.selectedRevenue;
    } else {
      revenueModel = this.revenueModellist.find(f=>this.selectedRevenue && f.id === this.selectedRevenue.id);
    }

    this.searchService.searchCriteria = {
      type: this.selectedSearchType,
      value: this.selectedSearchValue,
      industry: this.selectedIndustry,
      revenue: revenueModel ? revenueModel : null,
      limit: (limit || limit === 0)? limit.toString() : null,
      premium: (premium || premium === 0)? premium.toString(): null,
      retention: (retention || retention === 0)? retention.toString(): null,
      filter: this.enteredSearchFilter
    };
  }


  /**
   * loadSearchBy - Load the searchBy details from search service.
   * @todo - Will push the searchBy details to service layer.
   * @return {type}  description
   */
  loadSearchBy(){
    this.searchService.getSearchBy().subscribe(res=>{
       this.searchByList = res;
       if(this.searchService.searchCriteria) {
         this.selectedSearchBy = this.searchByList.find(f=>f.type === this.searchService.searchCriteria.type).id;
       }
       this.calcPlaceHolderForSearchValue();
    });
  }


  /**
   * loadRevenueModel - Load RevenueModel details from SearchService
   * @return {type}  description
   */
  loadRevenueModel(){
     this.searchService.getRevenueModel().subscribe((res: RevenueRangeResponseModel) =>{
       this.revenueModellist = res.rangeList;
       this.revenueModellist.forEach((revenue, index)=>{
          revenue.id = index + 1;
      });
      if(this.searchService.searchCriteria &&
         this.searchService.searchCriteria.type === 'SEARCH_BY_MANUAL_INPUT') {
          this.selectedRevenue = this.revenueModellist.find(f=>f.id === this.searchService.searchCriteria.revenue.id);
      }
    });
  }

  /**
   * Load Industry details from SearchService
   */
  loadIndustry(){
    this.searchService.getIndustry().subscribe((res: IndustryResponseModel) =>{
       this.industryList = res.industries;
       if(this.industryList){
        this.industryList.map(f=>{
          f.displayName = `${f.naics} ${f.naicsDescription}`;
        });
       }

       if(this.searchService.searchCriteria &&
        this.searchService.searchCriteria.type === 'SEARCH_BY_MANUAL_INPUT') {
         this.selectedIndustry = this.industryList.find(f=>f.naics === this.searchService.searchCriteria.industry.naics);
     }
    });
  }

  /**
   * If search criteria is already selected
   */
  loadSearchCriteria () {
     if (this.searchService.searchCriteria) {
        this.selectedSearchType   = this.searchService.searchCriteria.type
        this.selectedSearchValue  = this.searchService.searchCriteria.value;
        this.enteredSearchFilter  = this.searchService.searchCriteria.filter;
        this.selectedPremium      = new CommaConversionPipe().transform(this.searchService.searchCriteria.premium);
        this.selectedRetention    = new CommaConversionPipe().transform(this.searchService.searchCriteria.retention);
        this.selectedLimit        = new CommaConversionPipe().transform(this.searchService.searchCriteria.limit);
        this.enteredSearchFilter  = this.searchService.searchCriteria.filter;
     }

     if(this.searchService.selectedCompany) {
       this.loadedCompanyModel    = this.searchService.selectedCompany;
       this.selectedCompanyModel  = this.searchService.selectedCompany;
       this.isTriggerSearch.next(false);
     }
  }

  /**
   *
   */
  validateActions () {
    if(this.isManual){
      this.isActionEnabled = (this.selectedIndustry &&
                              this.selectedRevenue &&
                              this.selectedSearchValue &&
                              this.selectedIndustry.naics &&
                              this.selectedIndustry.naics !== '' &&
                              this.selectedRevenue.id &&
                              this.selectedRevenue.id !== -1 &&
                              this.selectedSearchValue !== '');
      return;
    }
    this.isActionEnabled = (this.selectedSearchValue !== '' && this.selectedCompanyModel !== null);
  }

  /**
   * onSearchChange - Fires on select company tile field changes
   */
  onSearchChange (): void {
    this.validateActions();
    if(this.isActionEnabled) {
      this.clearSearchCriteria();
    }
  }

  /**
   * onProgramChange - Fires when program structure tile field changes.
   *
   * @return {type}  - No return type
   */
  onProgramStructureChange () {
    if(this.searchService.searchCriteria ||
      this.searchService.selectedCompany){
        this.searchService.clearSearchCookies();
        this.snackBarService.Simple(SEARCHCRITERIA_CHANGED);
    }
    this.validateActions();
  }

  /**
   * Navigate to report page
   */
  onReport(){
    this.pageId = "report_page";
    if(this.isManual){
      this.setSelectedSearchCriteria();
      this.checkValidationPeerGroupLoss();
      this.router.navigate(['/report']);
      return;
    }
    this.validatePeerGroupAndRevenueIndustry();
  }

  /**
   * onSearch - description
   *
   * @param  {type} event description
   * @return {type}       description
   */
  onSearch(event){
    if(this.isManual) {
      this.onSearchChange();
      return;
    }

    if(event.keyCode === 13 ||
       event.type === 'click'){
       this.enteredSearchFilter = '';
       this.isTriggerSearch.next(true);
    }
  }

  /**
   * SearchBy details
   */
  onSearchByChange(){
    this.selectedSearchValue = '';
    this.calcPlaceHolderForSearchValue();
    if(this.searchService.searchCriteria &&
      this.selectedSearchType === this.searchService.searchCriteria.type) {
      this.loadSearchCriteria();
    }
  }

  /**
   * onRowSelection - description
   *
   * @param  {type} event description
   * @return {type}       description
   */
  onRowSelection(event){
    this.clearSearchCriteria();
    this.selectedCompanyModel = event as CompanyModel;
    this.validateActions();
  }

  /**
   * Build SearchCriteria and Navigate to dashboard
   */
  onAssessment(){
    this.pageId = "dashboard_page";
    if(this.isManual){
      this.setSelectedSearchCriteria();
      this.checkValidationPeerGroupLoss();
      this.router.navigate(['/dashboard']);
      return;
    }
    this.validatePeerGroupAndRevenueIndustry();
  }

  validatePeerGroupAndRevenueIndustry(){
    let validatePeer;
    let limit = new KmbConversionPipe().transform(this.selectedLimit);
    let premium = new KmbConversionPipe().transform(this.selectedPremium);
    let retention = new KmbConversionPipe().transform(this.selectedRetention);
    let companyId : any =  this.selectedCompanyModel.companyId;
    const selectedCompany = this.selectedCompanyModel;
    let naics: string ;
    let revenue_range: string;

    Observable.forkJoin(
      [this.searchService.checkValidationPeerGroupLoss(companyId, revenue_range,  naics),
        this.searchService.checkForRevenueAndIndustry(selectedCompany.companyId)])
          .subscribe((data) => {
            this.searchService.validationPeerGroup = data[0];

            if(data[1] && data[1].message){
              this.snackBarService.Simple(data[1].message);
            }else{
              this.selectedIndustry = data[1].industry;
              this.selectedRevenue = data[1].revenueRange;
              this.setSelectedSearchCriteria();

              switch (this.pageId) {
                case "dashboard_page":
                  this.router.navigate(['/dashboard']);    
                  break;
                case "report_page":
                  this.router.navigate(['/report']);
                  break;

                default:
                  break;
              }
              
            }
          },
          err => console.error(err)
        );
  }

  /**
   * onGaugeValidation - validate data of frequency and severity dial
   */

  checkValidationPeerGroupLoss(){
    let validatePeer;
    let limit = new KmbConversionPipe().transform(this.selectedLimit);
    let premium = new KmbConversionPipe().transform(this.selectedPremium);
    let retention = new KmbConversionPipe().transform(this.selectedRetention);
    let companyId : any;
    let naics: string ;
    let revenue_range: string;

    if(this.searchService.searchCriteria &&
      this.searchService.searchCriteria.type === "SEARCH_BY_MANUAL_INPUT"){
        naics = this.selectedIndustry.naicsDescription;
        revenue_range = this.selectedRevenue.rangeDisplay;
    }

    this.searchService.checkValidationPeerGroupLoss(companyId, revenue_range, naics).subscribe(
      (res : ValidationPeerGroupLossModel) => {
      this.searchService.validationPeerGroup = res;
    });


   }

  /**
   * onClearSearchValue - description
   *
   * @return {type}  description
   */
  onClearSearchValue () {
    this.selectedSearchValue = "";
  }

  /**
   * onFilterChange - Listens to the search filter on table.
   *
   * @param  {type} event - Carrys the filter element value
   * @return {type}       - No return type
   */
  onFilterChange (event) {
    this.enteredSearchFilter = event;
  }

  ngOnDestroy () {

  }
}
