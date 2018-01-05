import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from 'app/shared/animations/animations';
import { SearchService, MenuService, SessionService } from 'app/services/services';
import {DashboardScore} from 'app/model/model';
import { Router } from '@angular/router';

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
    public getDashboardScoreByManualInput: DashboardScore;
    public isFrequenycGuage: boolean;
    public isBenchmarkGuage: boolean;
    public isSeverityGuage: boolean;

    constructor(private searchService: SearchService,
                private menuService: MenuService,
                private sessionService: SessionService,
                private router: Router) {
        this.menuService.breadCrumb = 'Dashboard';
    }

    ngOnInit() {
        this.setupDashboardScoreInput();
        this.checkPermission();
    }

    checkPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission && permission.dashboard && (!permission.dashboard.hasAccess)) {
            this.router.navigate(['/403']);
        }
    }

    /**
     * create benchmark score chart input
     */
    setupDashboardScoreInput() {
        this.searchType = this.searchService.searchCriteria.type;
        if (this.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.companyId = this.searchService.selectedCompany.companyId;
            this.naics = null;
            this.revenueRange = null;
        }else{
            this.companyId = null;
            this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
            this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null;

        }

        this.chartType = 'BENCHMARK';

        this.getDashboardScoreByManualInput = {
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
