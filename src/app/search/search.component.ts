import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {DataSource} from '@angular/cdk';
import { MdSort, MdPaginator, PageEvent} from '@angular/material';
import { SearchService } from '../services/services';
import { SearchByModel, SearchModel, CompanyModel, IndustryModel, IndustryResponseModel, SearchCriteriaModel } from '../model/model';
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
  private searchValuePlaceHolder: string;
  private selectedIndustry: string;
  private selectedPremium: string;
  private selectedRetention: string;
  private selectedLimit: string;
  private selectedRevenue: string;
  private isManual: boolean;
  private isSearching: boolean;
  private searchByList: Array<SearchByModel>;
  private industryList: Array<IndustryModel>;
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
  }

  selectedRow(companyId){
    let company: CompanyModel =  this.searchResult.find(f=>f.companyId === companyId);
    this.searchService.selectedCompany = company;
  }

  calcPlaceHolderForSearchValue(){
    let searchByModel: SearchByModel =  this.searchByList.find(f=>f.id === this.selectedSearchBy);
    this.searchValuePlaceHolder = `Enter ${searchByModel.description}`;
    this.selectedSearchType = searchByModel.type;
    this.isManual = (searchByModel.type === "SEARCH_BY_MANUAL_INPUT")
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
    this.searchService.searchCriteria = {
      type: this.selectedSearchType,
      value: this.selectedSearchValue,
      industry: this.selectedIndustry,
      revenue: this.selectedRevenue,
      limit: this.selectedLimit,
      premium: this.selectedPremium,
      retention: this.selectedRetention
    };
    this.router.navigate(['/dashboard']);
  }

  doReport(){
    this.router.navigate(['/report']);
  }

  doSearch(event, isReady){
    console.log(event.keyCode);
    if(!this.isManual && (event.keyCode === 13 || isReady)){
        this.toggleProgress();
       this.searchService.getSearchResult(this.selectedSearchType, this.selectedSearchValue).subscribe((res: SearchModel)=>{
       this.searchResult = res.companies;
        this.clearData();
       const copiedData = this.searchDatabase.data.slice();
       res.companies.forEach(f=>copiedData.push(f));
       this.searchDatabase.dataChange.next(copiedData);
       this.toggleProgress();
      });
    }
    else{
      this.clearData();
       this.searchResult = null;
    }
  }

  clearData(){
       this.searchDatabase.clear();
       this.dataSource = new SearchDataSource(this.searchDatabase, this.sort, this.paginator);
       
  }
  
  loadData(event){
    console.log(event);
    
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

  loadIndustry(){
    this.searchService.getIndustry().subscribe((res: IndustryResponseModel) =>{
       this.industryList = res.industries;
       console.log(res);
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
    console.log('Hey');
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