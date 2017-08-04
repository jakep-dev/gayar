import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from '../shared/animations/animations';
import { SearchService } from '../services/services';
import { BenchmarkPremiumDistributionInput, LimitAdequacyChart } from '../model/benchmark.model';

@Component({
    selector: 'app-benchmark',
    templateUrl: './benchmark.component.html',
    styleUrls: ['./benchmark.component.scss'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class BenchmarkComponent implements OnInit {

    public searchType: string;
    public chartType: string;
    public companyId: number;
    public clientValue: string;
    public naics: string;
    public revenueRange: string;
    public limit: string;

    public benchmarkPremiumDistributionInput: BenchmarkPremiumDistributionInput;
    public getLimitAdequacyChartByManualInput: LimitAdequacyChart;


    constructor(private searchService: SearchService) { }

    ngOnInit() {
        this.searchType = this.searchService.searchCriteria.type;
        this.companyId = this.searchService.selectedCompany.companyId;
        this.chartType = 'PREMIUM';
        if (this.chartType === 'PREMIUM'){
            this.clientValue = this.searchService.searchCriteria.premium;
        } else {
            this.clientValue = this.searchService.searchCriteria.retention;
        }
        
        this.naics = this.searchService.searchCriteria.industry;
        this.revenueRange = this.searchService.searchCriteria.revenue;
        this.limit = this.searchService.searchCriteria.limit;

        this.benchmarkPremiumDistributionInput = {
            searchType: this.searchType,
            companyId: this.companyId,
            chartType: this.chartType,
            clientValue: this.clientValue,
            naics: this.naics,
            revenueRange: this.revenueRange
        }

        this.getLimitAdequacyChartByManualInput = {
          searchType: this.searchType,
          companyId: this.companyId,
          limits: this.limit,
          naics: this.naics,
          revenue_range: this.revenueRange
        }
    }

}
