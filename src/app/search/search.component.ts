import { Component, OnInit } from '@angular/core';
import { SearchService } from '../services/services';
import { SearchByModel, SearchModel, CompanyModel } from '../model/model';
import {DataSource} from '@angular/cdk';
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
  selectedSearchBy: number = 2;
  selectedSearchType: string;
  selectedSearchValue: string;
  searchValuePlaceHolder: string;
  selectedIndustry: string;
  private searchByList: Array<SearchByModel>;

  displayedColumns = ['depthScore',  'companyName', 'city', 'state', 'country', 'ticker', 'exchange', 'topLevel'];
  searchDatabase = new SearchDatabase();
  dataSource: SearchDataSource | null;

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.loadSearchBy();
     this.dataSource = new SearchDataSource(this.searchDatabase);
  }

  calcPlaceHolderForSearchValue(){
    let searchByModel: SearchByModel =  this.searchByList.find(f=>f.id === this.selectedSearchBy);
    this.searchValuePlaceHolder = `ENTER ${searchByModel.description}`;
    this.selectedSearchType = searchByModel.type;
  }

  doSearchByChange(){
    this.calcPlaceHolderForSearchValue();
  }

  doSearch(){
    this.searchService.getSearchResult(this.selectedSearchType, this.selectedSearchValue).subscribe((res: SearchModel)=>{
       const copiedData = this.searchDatabase.data.slice();
       res.companies.forEach(f=>copiedData.push(f));
       this.searchDatabase.dataChange.next(copiedData);
    });
    console.log(this.searchDatabase.data);
  }

  getData(){
    return {
            companyId: 0,
            ticker: '',
            exchange: '',
            depthScore: 2,
            companyName: '',
            city: '',
            state: '',
            country: '',
            topLevel: '',
            status: ''
        };
  }

  loadSearchBy(){
    this.searchService.getSearchBy().subscribe(res=>{
      this.searchByList = res;
       this.calcPlaceHolderForSearchValue();
    });
  }

}

export class SearchDatabase {
   dataChange: BehaviorSubject<Array<CompanyModel>> = new BehaviorSubject<Array<CompanyModel>>([]);
   get data(): Array<CompanyModel> { return this.dataChange.value; }

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