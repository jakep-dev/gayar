import {FrequencyInput} from '../model/model';
import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { FrequencyService, SearchService, MenuService } from 'app/services/services';
import { FrequencyDataModel, FrequencyDataResponseModel, FrequencyIndustryOverviewInput, FrequencyIncidentPieFlipData, FrequencyLossPieFlipData } from 'app/model/model';

@Component({
    selector: 'app-frequency',
    templateUrl: './frequency.component.html',
    styleUrls: ['./frequency.component.css'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class FrequencyComponent implements OnInit {
    peerGroupTable: Array<FrequencyDataModel>;
    companyLossesTable: Array<FrequencyDataModel>;
    frequencyIndustryOverviewInput : FrequencyIndustryOverviewInput

    columnsKeys = ['company_name', 'type_of_incident', 'incident_date_formatted', 'records_affected', 'type_of_loss', 'case_description'];
    hearderColumns = ['Company Name', 'Type of Incident', 'Incident Date', 'Records Affected', 'Type of Loss'];

    token: string;
    companyId: number;
    industry: string;
    revenue_range: string;
    searchType: string;
    chartType: string;
    naics: string;
    revenueRange: string;
    public frequencyInput: FrequencyInput;
    public getFrequencyIncidentFlipManualInput: FrequencyIncidentPieFlipData;
    public getFrequencyLossFlipManualInput: FrequencyLossPieFlipData;

    constructor(private frequencyService: FrequencyService,
        private menuService: MenuService,
        private searchService: SearchService) { }

    ngOnInit() {
        this.menuService.breadCrumb = 'Frequency';
        this.companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        this.industry = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription) ? this.searchService.searchCriteria.industry.naicsDescription : null;
        this.revenue_range = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay: null; 
        this.loadFrequencyDataTable();
        this.setupDistributionInput();
        this.setupFrequencyInput();
        this.setupfrequencyIncidentPieFlipInput();
        this.setupfrequencyLossPieFlipInput();
    }

    loadFrequencyDataTable() {
        this.frequencyService.getFrequencyDataTable(this.token, this.companyId, this.industry, this.revenue_range).subscribe((res: FrequencyDataResponseModel) => {
            this.peerGroupTable = res.peerGroup;
            if (res.company != null && res.company.length > 0) {
                this.companyLossesTable = res.company;
            }
        });
    }

    setupDistributionInput() {
        this.frequencyIndustryOverviewInput = {           
            companyId: this.companyId,
            naics : this.industry
        }
    }
    
    setupFrequencyInput() {
        let searchType = this.searchService.searchCriteria.type;
        this.companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay: null; 

        this.frequencyInput = {
            searchType: searchType,
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange
        };
    }

    /**
     * create incident flip chart input
     */
    setupfrequencyIncidentPieFlipInput() {
        let searchType = this.searchService.searchCriteria.type;
        this.companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay: null; 

        this.getFrequencyIncidentFlipManualInput = {
            searchType: this.searchType,
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange,
        }
    }

    /**
     * create loss flip chart input
     */
    setupfrequencyLossPieFlipInput() {

        let searchType = this.searchService.searchCriteria.type;
        this.companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay: null; 

        this.getFrequencyLossFlipManualInput = {
            searchType: this.searchType,
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange,
        }
    }

}
