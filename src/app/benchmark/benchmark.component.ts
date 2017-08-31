import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { SearchService } from '../services/services';
import { BenchmarkDistributionInput, BenchmarkLimitAdequacyInput, BenchmarkRateInput } from '../model/benchmark.model';

@Component({
    selector: 'app-benchmark',
    templateUrl: './benchmark.component.html',
    styleUrls: ['./benchmark.component.scss'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class BenchmarkComponent implements OnInit {

    public searchType: string;
    public companyId: number;
    public naics: string;
    public revenueRange: string;

    public benchmarkDistributionInput: BenchmarkDistributionInput;
    public benchmarkLimitAdequacyInput: BenchmarkLimitAdequacyInput;
    public benchmarkRateInput: BenchmarkRateInput;

    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.setupDistributionInput();
        this.setupLimitAdequacyInput();
        this.setupRateInput();
    }

    /**
     * create distribution chart input
     */
    setupDistributionInput() {
        let searchType = this.searchService.searchCriteria.type;
        let companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        let naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        let revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.description)? this.searchService.searchCriteria.revenue.description: null; 
        
        this.benchmarkDistributionInput = {
            searchType: searchType,
            companyId: companyId,
            premiumValue: this.searchService.searchCriteria.premium,
            limitValue: this.searchService.searchCriteria.limit,
            retentionValue: this.searchService.searchCriteria.retention,
            naics: naics,
            revenueRange: revenueRange
        }
    }

    /**
     * create limit adequacy chart input
     */
    setupLimitAdequacyInput() {
        let searchType = this.searchService.searchCriteria.type;
        let companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        let naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        let revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.id)? this.searchService.searchCriteria.revenue.id + '': null; 

        this.benchmarkLimitAdequacyInput = {
            searchType: searchType,
            companyId: companyId,
            limits: this.searchService.searchCriteria.limit,
            naics: naics,
            revenueRange: revenueRange
        };
    }

    /**
     * create rate per million chart input
     */
    setupRateInput() {
        let companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        let naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        let revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.id)? this.searchService.searchCriteria.revenue.id + '' : null; 

        this.benchmarkRateInput = {
            companyId: companyId,
            premiumValue: this.searchService.searchCriteria.premium,
            limitValue: this.searchService.searchCriteria.limit,
            naics: naics,
            revenueRange: revenueRange
        };
    }

}
