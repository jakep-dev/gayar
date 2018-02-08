import { Component, OnInit, Input, Output } from '@angular/core';
import { CompanyModel } from 'app/model/model';
import { AsyncSubject } from 'rxjs/AsyncSubject'; 

@Component({
  selector: 'app-search-table-mobile',
  templateUrl: './search-table-mobile.component.html',
  styleUrls: ['./search-table-mobile.component.scss']
})
export class SearchTableMobileComponent implements OnInit {

  @Input() dataSource: AsyncSubject<CompanyModel[]> = new  AsyncSubject<CompanyModel[]>();

  constructor() { }

  ngOnInit () {
    this.transformData();
  }

  onSingleRowToggle () {

  }

  onAllRowToggle () {

  }

  onRowSelection () {

  }

  onClick() {
    
  }

  transformData () {
    this.dataSource.asObservable().subscribe(()=> {
      
    });
  }
}
