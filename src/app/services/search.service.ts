import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  { Subject } from 'rxjs/Subject';
import { SearchModel, IndustryResponseModel, SearchByModel, CompanyModel, SearchCriteriaModel} from 'app/model/model';


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
    description: 'Advisen Number',
    type: 'SEARCH_BY_COMP_ID'
},
{
    id: 2,
    description: 'Company Name',
    type: 'SEARCH_BY_COMP_NAME'
},
{
    id: 3,
    description: 'Duns',
    type: 'SEARCH_BY_DUNS'
},
{
    id: 4,
    description: 'Ticker',
    type: 'SEARCH_BY_TICKER'
},
{
    id: 5,
    description: 'Manual Input',
    type: 'SEARCH_BY_MANUAL_INPUT'
}];