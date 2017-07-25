import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {DataSource} from '@angular/cdk';
import { MdSort, MdPaginator, PageEvent} from '@angular/material';
import { SearchService } from '../services/services';
import { SearchByModel, SearchModel, CompanyModel, IndustryModel, IndustryResponseModel, SearchCriteriaModel, RevenueModel } from '../model/model';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  private selectedSearchBy: number = 4;
  private selectedSearchType: string;
  private selectedSearchValue: string;
  private searchRule: string = "number";
  private searchValuePlaceHolder: string;
  private selectedIndustry: string;
  private selectedPremium: string;
  private selectedRetention: string;
  private selectedLimit: string;
  private selectedRevenue: number;
  private isManual: boolean;
  private isSearching: boolean;
  private isActionEnabled:boolean;
  private searchByList: Array<SearchByModel>;
  private industryList: Array<IndustryModel>;
  private revenueModellist: Array<RevenueModel>;
  private message: string;
  private displayedColumns = ['companyId', 'depthScore',  'companyName', 'city', 'state', 'country', 'ticker', 'exchange', 'topLevel'];
  private searchDatabase = new SearchDatabase();
  private dataSource: SearchDataSource | null;
  private searchResult: Array<CompanyModel>;
  private pageEvent: PageEvent;

  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;

  constructor(private searchService: SearchService, private router: Router) { }

  ngOnInit() {
     this.loadSearchBy();
     this.loadIndustry();
     this.loadRevenueModel();
  }

  selectedRow(companyId){
    let company: CompanyModel =  this.searchResult.find(f=>f.companyId === companyId);
    this.searchService.selectedCompany = company;
  }

  calcPlaceHolderForSearchValue(){
    let searchByModel: SearchByModel =  this.searchByList.find(f=>f.id === this.selectedSearchBy);
    this.searchRule = searchByModel.rule;
    this.selectedSearchType = searchByModel.type;
    this.isManual = (searchByModel.type === "SEARCH_BY_MANUAL_INPUT")
    this.searchValuePlaceHolder = this.isManual ? 'Enter Company Name' : `Enter ${searchByModel.description}`;
    if(this.isManual){
      this.searchDatabase.clear();
      this.searchResult = null;
      
    }
  }

  doSearchByChange(){
    this.selectedSearchValue = '';
    this.calcPlaceHolderForSearchValue();
  }

  doAssessment(){
    let revenueModel: RevenueModel = this.revenueModellist.find(f=>f.id == this.selectedRevenue);
    this.searchService.searchCriteria = {
      type: this.selectedSearchType,
      value: this.selectedSearchValue,
      industry: this.selectedIndustry,
      revenue: revenueModel ? revenueModel.value : '',
      limit: this.selectedLimit,
      premium: this.selectedPremium,
      retention: this.selectedRetention
    };
    console.log(this.searchService.searchCriteria );
    this.router.navigate(['/dashboard']);
  }

  doReport(){
    this.router.navigate(['/report']);
  }

  doValidation(){
    if(this.isManual){
      this.isActionEnabled = (this.selectedIndustry !== '' && this.selectedRevenue !== 0 && this.selectedSearchValue !== '');
      return;
    }
    
    this.isActionEnabled = (this.selectedSearchValue !== '' && this.searchService.selectedCompany != null);
  }

  doSearch(event, isReady){
    if(!this.isManual && (event.keyCode === 13 || isReady)){
      this.toggleProgress();
      this.searchService.getSearchResult(this.selectedSearchType, this.selectedSearchValue).subscribe((res: SearchModel)=>{
      this.searchResult = res.companies;
      this.clearData();
      if(res.companies){
        const copiedData = this.searchDatabase.data.slice();
        res.companies.forEach(f=>copiedData.push(f));
        this.searchDatabase.dataChange.next(copiedData);
      }
      else{
        this.message = "Your search did not match any company. Please refine your search";
      }
      this.toggleProgress();
      });
    }
    else{
      this.clearData();
       this.searchResult = null;
       this.searchService.selectedCompany = null;
    }
  }

  clearData(){
       this.searchDatabase.clear();
       this.dataSource = new SearchDataSource(this.searchDatabase, this.sort, this.paginator);
       
  }
  
  loadData(event){
    
    
  }

  toggleProgress(){
    this.isSearching = !this.isSearching;
  }

  loadSearchBy(){
    this.searchService.getSearchBy().subscribe(res=>{
       this.searchByList = res;
       this.calcPlaceHolderForSearchValue();
    });
  }

  loadRevenueModel(){
     this.searchService.getRevenueModel().subscribe(res=>{
       this.revenueModellist = res;
    });
  }

  loadIndustry(){
    this.searchService.getIndustry().subscribe((res: IndustryResponseModel) =>{
       this.industryList = res.industries;
    });
  }
}

export class SearchDatabase {
   dataChange: BehaviorSubject<Array<CompanyModel>> = new BehaviorSubject<Array<CompanyModel>>([]);
   get data(): Array<CompanyModel> { return this.dataChange.value; }
   get totalRecord(): number { return this.dataChange.value.length; }
   
   clear(){
     this.data.splice(0, this.totalRecord);
   }
   
   constructor(){}
}

export class SearchDataSource extends DataSource<any> {
  constructor(private _searchDatabase: SearchDatabase, 
              private _sort: MdSort, 
              private _paginator: MdPaginator) {
    super();
  }

 /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Array<CompanyModel>> {
    const displayDataChanges = [
      this._searchDatabase.dataChange,
      this._sort.mdSortChange,
      this._paginator.page
    ];
    
    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

   /** Returns a sorted copy of the database data. */
  getSortedData(): Array<CompanyModel> {
    const data = this._searchDatabase.data.slice();
    if (!this._sort.active || this._sort.direction == '') { return data; }
    console.log('Paginator details');
    console.log(this._paginator);
    data.sort((a, b) => {
      let propertyA: number|string = '';
      let propertyB: number|string = '';

      switch (this._sort.active) {
        case 'depthScore': [propertyA, propertyB] = [a.depthScore, b.depthScore]; break;
        case 'companyName': [propertyA, propertyB] = [a.companyName, b.companyName]; break;
        case 'city': [propertyA, propertyB] = [a.city, b.city]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'country': [propertyA, propertyB] = [a.country, b.country]; break;
        case 'ticker': [propertyA, propertyB] = [a.ticker, b.ticker]; break;
        case 'exchange': [propertyA, propertyB] = [a.exchange, b.exchange]; break;
        case 'topLevel': [propertyA, propertyB] = [a.topLevel, b.topLevel]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });

    return data;
  }

  getPaginationData(): Array<CompanyModel> {
    return null;
  }

  disconnect() {}
}