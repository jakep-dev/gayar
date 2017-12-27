import { FADE_ANIMATION } from '../shared/animations/animations';
import { Component, OnInit } from '@angular/core';
import { SearchService, MenuService, SessionService } from '../services/services';
import { BenchmarkDistributionInput, BenchmarkLimitAdequacyInput, BenchmarkRateInput } from '../model/benchmark.model';
import {Subscription} from "rxjs/Subscription";
import {MediaChange, ObservableMedia} from "@angular/flex-layout";
import { Router } from '@angular/router';

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
    isLimitAdequacy: boolean = false;
    isPremiumDist: boolean = false;
    isLimitDist: boolean = false;
    isRetentionDist: boolean = false;
    isRatePerMillion: boolean = false;

    public benchmarkDistributionInput: BenchmarkDistributionInput;
    public benchmarkLimitAdequacyInput: BenchmarkLimitAdequacyInput;
    public benchmarkRateInput: BenchmarkRateInput;

    watcher: Subscription;

    constructor(private searchService: SearchService,
                public menuService: MenuService,
                private media: ObservableMedia,
                private sessionService: SessionService,
                private router: Router) {
                this.watchForMedia(); }

    ngOnInit() {
        this.menuService.breadCrumb = 'Benchmark';
        this.checkPermission();
        this.setupDistributionInput();
        this.setupLimitAdequacyInput();
        this.setupRateInput();
        this.getPermission();
    }

    watchForMedia () {
      this.watcher = this.media.subscribe((change: MediaChange) => {
      //this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      console.log(change);
    });
    }

    checkPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission && permission.benchmark && (!permission.benchmark.hasAccess)) {
            this.router.navigate(['/noAccess']);
        }
    }

    /**
     * create distribution chart input
     */
    setupDistributionInput() {
        this.benchmarkDistributionInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            premiumValue: this.searchService.getPremium,
            limitValue: this.searchService.getLimit,
            retentionValue: this.searchService.getRetention,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        }
    }

    /**
     * create limit adequacy chart input
     */
    setupLimitAdequacyInput() {
        this.benchmarkLimitAdequacyInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            limits: this.searchService.getLimit,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRangeId
        };
    }

    /**
     * create rate per million chart input
     */
    setupRateInput() {
        this.benchmarkRateInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            premiumValue: this.searchService.getPremium,
            limitValue: this.searchService.getLimit,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRangeId
        };
    }

    getPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission){
            this.isLimitAdequacy = permission.benchmark && permission.benchmark.limitAdequacy && permission.benchmark.limitAdequacy.hasAccess;
            this.isPremiumDist = permission.benchmark && permission.benchmark.premium && permission.benchmark.premium.hasAccess;
            this.isLimitDist = permission.benchmark && permission.benchmark.limit && permission.benchmark.limit.hasAccess;
            this.isRetentionDist = permission.benchmark && permission.benchmark.retention && permission.benchmark.retention.hasAccess;
            this.isRatePerMillion = permission.benchmark && permission.benchmark.rate && permission.benchmark.rate.hasAccess;
        }
    }

}
