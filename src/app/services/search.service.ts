import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { SessionStorageService } from 'app/services/session-storage.service';
import { APPCONSTANTS } from 'app/app.const';
import { SearchModel, IndustryResponseModel, SearchByModel, CompanyModel,
         SearchCriteriaModel, RevenueModel, ValidationMessageModel, RevenueRangeResponseModel } from 'app/model/model';

@Injectable()
export class SearchService extends BaseService {
    private _sessionStorageService: SessionStorageService;
    private _searchCriteria: SearchCriteriaModel = null;
    private _selectedCompany: CompanyModel = null;
    public get selectedCompany(): CompanyModel {
        return this._selectedCompany ||
               this._sessionStorageService.getItem<CompanyModel>(APPCONSTANTS.SESSION_STORAGE_KEYS.SELECTED_COMPANY);
    }
    public set selectedCompany(companyModel: CompanyModel) {
        this._selectedCompany = companyModel;
        this._sessionStorageService.setItem(APPCONSTANTS.SESSION_STORAGE_KEYS.SELECTED_COMPANY, companyModel);
    }

    public get searchCriteria(): SearchCriteriaModel {
        return this._searchCriteria ||
               this._sessionStorageService.getItem<SearchCriteriaModel>(APPCONSTANTS.SESSION_STORAGE_KEYS.SELECTED_SEARCH_CRITERIA);;
    }
    public set searchCriteria(searchCriteriaModel: SearchCriteriaModel) {
        this._searchCriteria = searchCriteriaModel;
        this._sessionStorageService.setItem(APPCONSTANTS.SESSION_STORAGE_KEYS.SELECTED_SEARCH_CRITERIA, searchCriteriaModel);
    }


    public hasValidSearchCriteria () : boolean {
        return (this.selectedCompany != null || this.searchCriteria != null)
    }

    public clearSearchCookies () {
        this.searchCriteria = null;
        this.selectedCompany = null;
        this._sessionStorageService.removeItem(APPCONSTANTS.SESSION_STORAGE_KEYS.SELECTED_COMPANY);
        this._sessionStorageService.removeItem(APPCONSTANTS.SESSION_STORAGE_KEYS.SELECTED_SEARCH_CRITERIA);
    }

    /**
     * Extract the search type. 
     */
    public get getSearchType () {
        return this.searchCriteria.type;
    }

    /**
     * Extract the company Id.
     */
    public get getCompanyId () {
        if(!(this.selectedCompany && this.selectedCompany.companyId)){
            return null;
        }

        return this.selectedCompany.companyId;
    }

    /**
     * Extract the naics.
     */
    public get getNaics () {
        if(!(this.searchCriteria.industry && this.searchCriteria.industry.naicsDescription)){
            return null;
        }
        
        return this.searchCriteria.industry.naicsDescription;
    }

    /**
     * Extract the revenue range.
     */
    public get getRevenueRange () {
        if(!(this.searchCriteria.revenue && this.searchCriteria.revenue.rangeDisplay)){
            return null;
        }
        return `${this.searchCriteria.revenue.id} ` ;
    }

    /**
     * Extract the premium.
     */
    public get getPremium () {
        if(!(this.searchCriteria.premium && this.searchCriteria.premium !== '0')) {
            return null;
        }
        return this.searchCriteria.premium;
    }

    /**
     * Extract the limit.
     */
    public get getLimit () {
        if(!(this.searchCriteria.limit && this.searchCriteria.limit !== '0')) {
            return null;
        }

        return this.searchCriteria.limit;
    }

    /**
     * Extract the retention
     */
    public get getRetention () {
        if(!(this.searchCriteria.retention && this.searchCriteria.retention != '0')) {
            return null;
        }

        return this.searchCriteria.retention;
    }


    constructor(http: Http, sessionStorageService: SessionStorageService) {
        super(http);
        this._sessionStorageService = sessionStorageService;
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
    public getRevenueModel(): Observable<RevenueRangeResponseModel>{
        try{
            return super.Post<RevenueRangeResponseModel>('/api/getRangeList', {
            });
         }
         catch(e){

         }
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
                'companyId': companyId
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
