import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchService, SessionService, MenuService } from 'app/services/services';
import { SearchByModel, SearchModel, CompanyModel, IndustryModel, IndustryResponseModel, RevenueRangeResponseModel, SearchCriteriaModel, RevenueModel } from 'app/model/model';
import { KmbConversionPipe } from 'app/shared/pipes/kmb-conversion.pipe';
import { BehaviorSubject  } from 'rxjs/BehaviorSubject';
import { AsyncSubject  } from 'rxjs/AsyncSubject';
import { Observable  } from 'rxjs/Observable';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
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
              private route: ActivatedRoute) { 
      
  }

  ngOnInit() {
     this.menuService.breadCrumb = 'Search';
     this.loadSearchBy();
     this.loadIndustry();
     this.loadRevenueModel();
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
  onValidation(){
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
    this.isActionEnabled = (this.selectedSearchValue !== '' && this.searchService.selectedCompany != null);
  }

  onSearch(event, isReady){
    if(!this.isManual && (event.keyCode === 13 || isReady)){
       this.isTriggerSearch.next(true);
    }
    else{
       this.searchService.selectedCompany = null;
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
    this.searchService.selectedCompany = event as CompanyModel;
    this.onValidation();
  }

  /**
   * Build SearchCriteria and Navigate to dashboard
   */
  onAssessment(){
    console.log(this.selectedRevenue);
    let revenueModel: RevenueModel = this.revenueModellist.find(f=>this.selectedRevenue && f.id === this.selectedRevenue.id);
    this.searchService.searchCriteria = {
      type: this.selectedSearchType,
      value: this.selectedSearchValue,
      industry: this.selectedIndustry,
      revenue: revenueModel ? revenueModel : null,
      limit: new KmbConversionPipe().transform(this.selectedLimit).toString(),
      premium: new KmbConversionPipe().transform(this.selectedPremium).toString(),
      retention: new KmbConversionPipe().transform(this.selectedRetention).toString()
    };

    console.log(this.searchService.searchCriteria);
    console.log(this.searchService.selectedCompany);

    this.router.navigate(['/dashboard']);
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
       this.calcPlaceHolderForSearchValue();
    });
  }

  /**
   * Load RevenueModel details from SearchService
   */
  loadRevenueModel(){
     this.searchService.getRevenueModel().subscribe((res: RevenueRangeResponseModel) =>{
       console.log('revenue range', res)
       this.revenueModellist = res.rangeList;
       this.revenueModellist.forEach((revenue, index)=>{
          revenue.id = index + 1;
      });
    });
  }

  /**
   * Load Industry details from SearchService
   */
  loadIndustry(){
    this.searchService.getIndustry().subscribe((res: IndustryResponseModel) =>{
       this.industryList = res.industries;
       this.industryList.forEach(f=>{
         f.displayName = `${f.naics} ${f.naicsDescription}`;
       });
    });
  }

  onSelectionComplete () {

  }
}