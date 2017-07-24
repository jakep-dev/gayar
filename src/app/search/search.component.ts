import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {DataSource} from '@angular/cdk';
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
  private selectedSearchBy: number = 2;
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

  doSearch(){
    this.dataSource = null;
    if(!this.isManual && this.selectedSearchValue.length >= 3){
      this.toggleProgress();
      this.searchService.getSearchResult(this.selectedSearchType, this.selectedSearchValue).subscribe((res: SearchModel)=>{
       this.searchResult = res.companies;
       this.dataSource = new SearchDataSource(this.searchDatabase);
       const copiedData = this.searchDatabase.data.slice();
       res.companies.forEach(f=>copiedData.push(f));
       this.searchDatabase.dataChange.next(copiedData);
       this.toggleProgress();
    });
    }
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
     console.log(this.dataChange.value)
     this.dataChange.value.splice(0, this.totalRecord);
     console.log(this.dataChange.value)
   }
   
   constructor(){}
}

export class SearchDataSource extends DataSource<any> {
  constructor(private _searchDatabase: SearchDatabase) {
    super();
  }

 /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Array<CompanyModel>> {
    return this._searchDatabase.dataChange;
  }

  disconnect() {}
}