import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SessionService, MenuService } from 'app/services/services';
import { SearchByModel, SearchModel, CompanyModel, IndustryModel, IndustryResponseModel, RevenueRangeResponseModel, SearchCriteriaModel, RevenueModel } from 'app/model/model';
import { KmbConversionPipe, CommaConversionPipe } from 'app/shared/pipes/pipes';
import { BehaviorSubject  } from 'rxjs/BehaviorSubject';
import { AsyncSubject  } from 'rxjs/AsyncSubject';
import { Observable  } from 'rxjs/Observable';
import { SnackBarService } from 'app/shared/shared';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  selectedSearchBy: number = 4;
  selectedSearchType: string;
  selectedSearchValue: string;
  isTriggerSearch: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  searchRule: string = "number";
  searchValuePlaceHolder: string;
  selectedIndustry: IndustryModel;
  selectedPremium: string;
  selectedRetention: string;
  selectedLimit: string;
  selectedRevenue: RevenueModel;
  selectedCompanyModel: CompanyModel;
  loadedCompanyModel: CompanyModel;
  isManual: boolean;
  isSearching: boolean;
  isActionEnabled:boolean;
  searchByList: Array<SearchByModel>;
  industryList: Array<IndustryModel>;
  revenueModellist: Array<RevenueModel>;

  constructor(private searchService: SearchService,
              private menuService: MenuService,
              private sessionService: SessionService,
              private router: Router,
              private route: ActivatedRoute,
              private snackBarService: SnackBarService) {

  }

  ngOnInit() {
     this.menuService.breadCrumb = 'Search';
     this.loadSearchBy();
     this.loadIndustry();
     this.loadRevenueModel();
     this.loadSearchCriteria();
  }

  /**
   * If search criteria is already selected
   */
  loadSearchCriteria () {
     if (this.searchService.searchCriteria) {
        this.selectedSearchType = this.searchService.searchCriteria.type
        this.selectedSearchValue = this.searchService.searchCriteria.value;
        this.selectedPremium = new CommaConversionPipe().transform(this.searchService.searchCriteria.premium);
        this.selectedRetention = new CommaConversionPipe().transform(this.searchService.searchCriteria.retention);
        this.selectedLimit = new CommaConversionPipe().transform(this.searchService.searchCriteria.limit);
     }

     if(this.searchService.selectedCompany) {
       this.loadedCompanyModel = this.searchService.selectedCompany;
       this.isTriggerSearch.next(true);
     }
  }

  /**
   * Calculate place holder for search value.
   */
  calcPlaceHolderForSearchValue(){
    let searchByModel: SearchByModel =  this.searchByList.find(f=>f.id === this.selectedSearchBy);
    this.searchRule = searchByModel.rule;
    this.selectedSearchType = searchByModel.type;
    this.isManual = (searchByModel.type === "SEARCH_BY_MANUAL_INPUT")
    this.searchValuePlaceHolder = this.isManual ? 'Enter Company Name' : `Enter ${searchByModel.description}`;
  }

  /**
   * Set Search Type based on searchBy
   */
  setSearchType () {
    let searchByModel: SearchByModel =  this.searchByList.find(f=>f.id === this.selectedSearchBy);
    if(searchByModel){
      this.selectedSearchType = searchByModel.type;
    }
  }

  /**
   *
   */
  onValidation () {
    this.clearSearchCriteria();
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
    this.isActionEnabled = (this.selectedSearchValue !== '' && this.selectedCompanyModel!= null);
  }

  clearSearchCriteria () {
    if(this.searchService.searchCriteria || this.searchService.selectedCompany){
      if(this.searchService.selectedCompany) {
        this.loadedCompanyModel = null;
        this.selectedCompanyModel = this.searchService.selectedCompany;
      }
      this.searchService.clearSearchCookies();
      this.snackBarService.Simple('Please click on Assessment/Report to rerun the analysis as changes were made to the search criteria.');
    }
  }

  onSearch(event){
    if(!this.isManual && (event.keyCode === 13 || event.type === 'click')){
       this.isTriggerSearch.next(true);
    }
  }

  /**
   * SearchBy details
   */
  onSearchByChange(){
    this.selectedSearchValue = '';
    this.calcPlaceHolderForSearchValue();
    this.onValidation();
  }

  onSearchTableSelectionCompleted(event){
    this.selectedCompanyModel = event as CompanyModel;
    this.onValidation();
  }

  /**
   * Build SearchCriteria and Navigate to dashboard
   */
  onAssessment(){
    if(this.isManual){
      this._setSelectedSearchCriteria();
      this.router.navigate(['/dashboard']);
      return;
    }
    this._validateRevenueAndIndustry();
  }

  onClearSearchValue () {
    this.selectedSearchValue = "";
  }


  /**
   * validateRevenueAndIndustry - description
   *
   * @return {type}  description
   */
  private _validateRevenueAndIndustry () {
    const selectedCompany = this.selectedCompanyModel;
    this.searchService.checkForRevenueAndIndustry(selectedCompany.companyId).subscribe((data)=>{
        if(data && data.message){
          this.snackBarService.Simple(data.message);
        }else{
          this._setSelectedSearchCriteria();
          this.router.navigate(['/dashboard']);
        }
    });
  }


  /**
   * private _setSelectedSearchCriteria - set the selected/entered search criteria
   *
   * @return {type}  description
   */

  private _setSelectedSearchCriteria () {
    let revenueModel: RevenueModel = this.revenueModellist.find(f=>this.selectedRevenue && f.id === this.selectedRevenue.id);
    let limit = new KmbConversionPipe().transform(this.selectedLimit);
    let premium = new KmbConversionPipe().transform(this.selectedPremium);
    let retention = new KmbConversionPipe().transform(this.selectedRetention);

    this.searchService.searchCriteria = {
      type: this.selectedSearchType,
      value: this.selectedSearchValue,
      industry: this.selectedIndustry,
      revenue: revenueModel ? revenueModel : null,
      limit: (limit || limit === 0)? limit.toString() : null,
      premium: (premium || premium === 0)? premium.toString(): null,
      retention: (retention || retention === 0)? retention.toString(): null
    };

    if(!this.isManual){
      this.searchService.selectedCompany = this.selectedCompanyModel;
    }
  }

  /**
   * Navigate to report page
   */
  onReport(){
    this.router.navigate(['/report']);
  }

  /**
   * Load SearchBy details from SearchService
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
   * Load RevenueModel details from SearchService
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
          console.log('SelectedRevenue ', this.selectedRevenue);
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

  onSelectionComplete () {

  }

  ngOnDestroy () {

  }
}
