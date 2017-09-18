import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from 'app/shared/animations/animations';
import { SearchService, MenuService } from 'app/services/services';
import {BenchmarkScore} from 'app/model/model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class DashboardComponent implements OnInit {

    public searchType: string;
    public chartType: string;
    public companyId: number;
    public naics: string;
    public revenueRange: string;

    public getBenchmarkScoreByManualInput: BenchmarkScore;

    constructor(private searchService: SearchService,
                private menuService: MenuService) {
        this.menuService.breadCrumb = 'Dashboard';
    }

    ngOnInit() {
        this.setupBenchmarkScoreInput();      
    }

    /**
     * create benchmark score chart input
     */
    setupBenchmarkScoreInput() {
        this.searchType = this.searchService.searchCriteria.type;
        if (this.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.companyId = this.searchService.selectedCompany.companyId;
        }

        this.chartType = 'BENCHMARK';
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null; 

        this.getBenchmarkScoreByManualInput = {
            searchType: this.searchType,
            chartType: this.chartType,
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange,
            limit : this.searchService.searchCriteria.limit,
            retention: this.searchService.searchCriteria.retention,
        }
    }

  }
