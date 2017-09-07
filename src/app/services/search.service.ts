import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  { Subject } from 'rxjs/Subject';
import { SearchModel, IndustryResponseModel, RevenueRangeResponseModel, SearchByModel, CompanyModel, SearchCriteriaModel, RevenueModel} from 'app/model/model';


@Injectable()
export class SearchService extends BaseService {
    public selectedCompany: CompanyModel;
    public searchCriteria: SearchCriteriaModel;

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

    public getRevenueModel(): Observable<RevenueRangeResponseModel>{
        try{
            return super.Post<RevenueRangeResponseModel>('/api/getRangeList', {
            });    
         }
         catch(e){
 
         }
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

    public getIndustry(): Observable<IndustryResponseModel>{
        try{
           return super.Post<IndustryResponseModel>('/api/getIndustries', {});    
        }
        catch(e){

        }
    }
}

const SearchBy: Array<SearchByModel> = [{
    id: 1,
    description: 'Advisen Company ID',
    type: 'SEARCH_BY_COMP_ID',
    rule: 'number'
},
{
    id: 2,
    description: 'Company Name',
    type: 'SEARCH_BY_COMP_NAME',
    rule: 'text'
},
{
    id: 3,
    description: 'DUNS Number',
    type: 'SEARCH_BY_DUNS',
    rule: 'number'
},
{
    id: 4,
    description: 'Ticker',
    type: 'SEARCH_BY_TICKER',
    rule: 'text'
},
{
    id: 5,
    description: 'Manual Input',
    type: 'SEARCH_BY_MANUAL_INPUT',
    rule: 'text'
}];