import { Component, OnInit, OnChanges, ViewChild, ElementRef, Output, Input, EventEmitter } from '@angular/core';
import { DataSource } from '@angular/cdk';
import { MdPaginator, MdSort, MdTable } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { CompanyModel, SearchModel } from 'app/model/model';
import { SearchService } from 'app/services/services';
import { APPCONSTANTS } from 'app/app.const';
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';

const { SEARCH_SCREEN_NO_RESULT } = APPCONSTANTS;

@Component({
  selector: 'app-search-table',
  templateUrl: './search-table.component.html',
  styleUrls: ['./search-table.component.scss'],
  providers: [ SearchService ]
})
export class SearchTableComponent implements OnInit {
  @Input() searchType: string;
  @Input() searchValue: string;
  @Input() loadedCompanyModel: CompanyModel;
  @Input() onTriggerSearch: AsyncSubject<boolean> = new AsyncSubject<boolean>();
  @Output() onSelectionCompleted: EventEmitter<CompanyModel> = new EventEmitter<CompanyModel>(true);

  displayedColumns = this.getColumns();
  searchTableDatabase = new SearchTableDatabase();
  dataSource: SearchTableDataSoruce | null;
  noResultMsg: string = null;
  isProcessing: boolean = false;
  searchResultSubscription: Subscription;

  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild('filter') filter: ElementRef;


  constructor(private searchService: SearchService) { }
  ngOnInit() {
    this._defaultSort();
    this.dataSource = new SearchTableDataSoruce(this.searchTableDatabase, this.paginator, this.sort);
    this.watchForFilter();
    this.onTriggerSearchEvent();
  }

  /**
   * Toggle the isprocessing flag helps to display the message on table
   */
  private _toggleProcessing() {
    this.isProcessing = !this.isProcessing;
  }

  /**
   * Trigger Search Event from parent
   */
  onTriggerSearchEvent () {
    if(this.onTriggerSearch){
      this.onTriggerSearch.asObservable().subscribe(()=>{
        if(this.searchType && this.searchValue){
          this.noResultMsg = null;
          this.getCompanyDetails();
        }
      });
    }
  }

  /**
   * Watch for filter changes
   */
  watchForFilter () {
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  /**
   *
   * @param companyModel - Selected CompanyModel
   */
  onRowSelection (companyModel: CompanyModel) {
    companyModel.isSelected = true;
    this.onSelectionCompleted.emit(companyModel);
  }

  /**
   * Get company details based on searchType and searchValue
   */
  getCompanyDetails () {
    this._resetPagination();
    this.searchTableDatabase.deleteAllRecords();
    if(this.searchResultSubscription && !this.searchResultSubscription.closed){
      this.searchResultSubscription.unsubscribe();
    }
    this.isProcessing = true;
    this.searchResultSubscription = this.searchService
        .getSearchResult(this.searchType, this.searchValue)
        .subscribe((data: SearchModel) =>
        {
          this.isProcessing = false;
          if(!data || !data.companies || data.companies.length == 0){
            this.noResultMsg = SEARCH_SCREEN_NO_RESULT;
            return;
          }
          data.companies = this._preSelectCompanyModel(data.companies);
          this.searchTableDatabase.addRecord(data.companies);
        })
  }

  _preSelectCompanyModel (companies: Array<CompanyModel>) : Array<CompanyModel> {
    if(companies && this.loadedCompanyModel){
      companies.forEach(comp=> {
        if(comp.companyId === this.loadedCompanyModel.companyId) {
          comp.isSelected = true;
        }
      });
    }
    return companies;
  }


  /**
   * Reset the pagination properties
   */
  private _resetPagination () {
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 10;
  }

  /**
   * Set the default sorting order
   */
  private _defaultSort () {
    this.sort.disableClear = true;
    this.sort.direction = 'desc';
    this.sort.active = "depthScore";
  }


  /**
   * Get column details
   */
  getColumns () {
    return ['companyId', 'depthScore',  'companyName', 'city', 'state', 'country', 'ticker', 'exchange', 'topLevel', 'status'];
  }
}

/**
 * SearchTableDataSource
 */
export class SearchTableDataSoruce extends DataSource<any> {
  filterChange = new BehaviorSubject('');
  get filter(): string { return this.filterChange.value; }
  set filter(filter: string) { this.filterChange.next(filter);}

  constructor (private searchTableDatabase: SearchTableDatabase,
               private paginator: MdPaginator,
               private sort: MdSort) {
    super();
  }

  connect(): Observable<CompanyModel[]> {
    const displayDataChanges = [
      this.searchTableDatabase.dataChange,
      this.paginator.page,
      this.sort.mdSortChange,
      this.filterChange
    ];
    return Observable.merge(...displayDataChanges).map(()=>{
        let data = this.getFilteredData().slice();
            data = this.getSortedData(data).slice();
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    });
  }

  disconnect() {}

  private getSortedData (data: Array<CompanyModel>) : Array<CompanyModel> {
    if (!this.sort.active || this.sort.direction == '') { return data; }

    return data.sort((a,b)=>{
      let propertyA: number | string = '';
      let propertyB: number | string = '';
      switch(this.sort.active){
        case 'city': [propertyA, propertyB] = [a.city, b.city]; break;
        case 'companyId': [propertyA, propertyB] = [a.companyId, b.companyId]; break;
        case 'companyName': [propertyA, propertyB] = [a.companyName, b.companyName]; break;
        case 'country': [propertyA, propertyB] = [a.country, b.country]; break;
        case 'depthScore': [propertyA, propertyB] = [a.depthScore, b.depthScore]; break;
        case 'exchange': [propertyA, propertyB] = [a.exchange, b.exchange]; break;
        case 'state': [propertyA, propertyB] = [a.state, b.state]; break;
        case 'status': [propertyA, propertyB] = [a.status, b.status]; break;
        case 'ticker': [propertyA, propertyB] = [a.ticker, b.ticker]; break;
        case 'topLevel': [propertyA, propertyB] = [a.topLevel, b.topLevel]; break;
      }
        var multi = (this.sort.direction == 'asc' ? 1 : -1);
        return this._sorter(propertyA, propertyB, multi);
    });
  }

  private _sorter(a, b, multi){
      if (a === b)
        return 0;
    else if (a === null) 
      return 1;
    else if (b === null)  
      return -1;
    else        {
      let valueA = isNaN(+a) ? a : +a;
      let valueB = isNaN(+b) ? b : +b;
      if(isNaN(valueA)){
        return valueA.localeCompare(valueB) * multi;
      }
      else{
        return ((valueA < valueB) ? -1 : 1) * multi;
      }
    }
  }

  private getFilteredData () : Array<CompanyModel> {
    const data = this.searchTableDatabase.data.slice();
    if(this.filter.toLocaleLowerCase() === ''){ return data; }

    return data.filter((item: CompanyModel) => {
       let searchStr = `${item.depthScore}${item.city}${item.state}${item.ticker}${item.exchange}${item.topLevel}${item.status}${item.companyName}${item.country}`.toLocaleLowerCase();
       return searchStr.indexOf(this.filter.toLocaleLowerCase()) != -1;
    });
  }
}

/**
 * SearchTableDatabase helps to hold the record details
 */
export class SearchTableDatabase {
  dataChange: BehaviorSubject<CompanyModel[]> = new BehaviorSubject<CompanyModel[]>([]);
  get data(): CompanyModel[] { return this.dataChange.value; }

  addRecord(CompanyModel: CompanyModel[]): void {
    this.dataChange.next(CompanyModel);
  }

  deleteAllRecords () {
    this.dataChange.next([]);
  }
}
