import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import  { Subject } from 'rxjs/Subject';
import { SearchModel, IndustryResponseModel, SearchByModel, CompanyModel, 
         SearchCriteriaModel, RevenueModel, ValidationMessageModel } from 'app/model/model';


@Injectable()
export class SearchService extends BaseService {
    public selectedCompany: CompanyModel;
    public searchCriteria: SearchCriteriaModel;

    constructor(http: Http) {
        super(http);
    }
    
    /**
     * Get all search by value details
     */
    public getSearchBy(): Observable<Array<SearchByModel>>{
        let subject = new Subject<Array<SearchByModel>>();
        setTimeout(()=>{
                subject.next(SearchBy);
                subject.complete();
        }, 1);
        return subject;
    }

    /**
     * Get revenue model details
     */
    public getRevenueModel(): Observable<Array<RevenueModel>>{
        let subject = new Subject<Array<RevenueModel>>();
        setTimeout(()=>{
                subject.next(RevenueModel);
                subject.complete();
        }, 1);
        return subject;
    }

    /**
     * Get the search result for respective searchByType and searchValue
     * @param searchByType - COMP_NAME | COMP_ID | TICKER | DUNS
     * @param searchValue  - Searching value
     */
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

    /**
     * Get all industry details
     */
    public getIndustry(): Observable<IndustryResponseModel>{
        try{
           return super.Post<IndustryResponseModel>('/api/getIndustries', {});    
        }
        catch(e){

        }
    }

    /**
     * Check for company revenue and industry
     * @param companyId - Selected company Id
     */
    public checkForRevenueAndIndustry(companyId: number): Observable<ValidationMessageModel> {
        try {
            return super.Post<ValidationMessageModel>('/api/checkForRevenueAndIndustry', {
                'company_id': companyId
            })
        } catch (e) {
            
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

const RevenueModel: Array<RevenueModel> = [{
    id: 1,
    description: 'Less than $25M',
    value: '0-25000000'
},
{
    id: 2,
    description: '$25M to < $100M',
    value: '25000000-100000000'
},
{
    id: 3,
    description: '$100M to < $250M',
    value: '100000000-250000000'
},
{
    id: 4,
    description: '$250M to < $500M',
    value: '250000000-500000000'
},
{
    id: 5,
    description: '$500M to < $1B',
    value: '500000000-1000000000'
},
{
    id: 6,
    description: '$1B to Greater',
    value: '1000000000-'
}];