import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  { Subject } from 'rxjs/Subject';
import { SearchModel, IndustryModel, SearchByModel } from 'app/model/model';


@Injectable()
export class SearchService extends BaseService {
    public companyId: number;

    constructor(http: Http) {
        super(http);
    }
    
    public getSearchBy(): Observable<Array<SearchByModel>>{
        let subject = new Subject<Array<SearchByModel>>();
        setTimeout(()=>{
                subject.next(SearchBy);
                subject.complete();
        }, 1);
        return subject;
    }

    public getSearchResult(searchByType: string, searchValue: string): Observable<SearchModel>{
        try{
           return super.Post<SearchModel>('/api/doCompanySearch', {
               'searchType': searchByType,
               'searchValue': searchValue
           });    
        }
        catch(e){

        }
    }

    public getIndustry(): Observable<IndustryModel>{
        try{
           return super.Post<IndustryModel>('/api/getIndustries', {});    
        }
        catch(e){

        }
    }
}

const SearchBy: Array<SearchByModel> = [{
    id: 1,
    description: 'ADVISEN',
    type: 'SEARCH_BY_COMP_ID'
},
{
    id: 2,
    description: 'COMPANY NAME',
    type: 'SEARCH_BY_COMP_NAME'
},
{
    id: 3,
    description: 'DUNS',
    type: 'SEARCH_BY_DUNS'
},
{
    id: 4,
    description: 'TICKER',
    type: 'SEARCH_BY_TICKER'
},
{
    id: 5,
    description: 'MANUAL INPUT',
    type: 'SEARCH_BY_MANUAL_INPUT'
}];