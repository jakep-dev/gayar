import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { SearchService, MenuService } from '../services/services';
import { BenchmarkDistributionInput, BenchmarkLimitAdequacyInput, BenchmarkRateInput } from '../model/benchmark.model';
import {Subscription} from "rxjs/Subscription";
import {MediaChange, ObservableMedia} from "@angular/flex-layout";

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

    watcher: Subscription;

    constructor(private searchService: SearchService,
                private menuService: MenuService,
                private media: ObservableMedia) {
                this.watchForMedia(); }

    ngOnInit() {
        this.menuService.breadCrumb = 'Benchmark';
        this.setupDistributionInput();
        this.setupLimitAdequacyInput();
        this.setupRateInput();
    }

    watchForMedia () {
      this.watcher = this.media.subscribe((change: MediaChange) => {
      //this.activeMediaQuery = change ? `'${change.mqAlias}' = (${change.mediaQuery})` : "";
      console.log(change);
    });
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
            revenueRange: this.searchService.getRevenueRange
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

}
