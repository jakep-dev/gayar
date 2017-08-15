import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from '../shared/animations/animations';
import { SearchService } from '../services/services';
import { BenchmarkDistributionInput, BenchmarkLimitAdequacyInput } from '../model/benchmark.model';

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
    
    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.searchType = this.searchService.searchCriteria.type;
        this.companyId = this.searchService.selectedCompany.companyId;
        this.naics = this.searchService.searchCriteria.industry;
        this.revenueRange = this.searchService.searchCriteria.revenue;

        this.benchmarkDistributionInput = {
            searchType: this.searchType,
            companyId: this.companyId,
            premiumValue: this.searchService.searchCriteria.premium,
            limitValue: this.searchService.searchCriteria.limit,
            retentionValue: this.searchService.searchCriteria.retention,
            naics: this.naics,
            revenueRange: this.revenueRange
        }
        this.benchmarkLimitAdequacyInput = {
          searchType: this.searchType,
          companyId: this.companyId,
          limits: this.searchService.searchCriteria.limit,
          naics: this.naics,
          revenueRange: this.revenueRange
        }
    }

}
