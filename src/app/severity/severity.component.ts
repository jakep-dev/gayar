import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { SeverityService, SearchService, MenuService } from 'app/services/services';
import { SeverityInput } from '../model/model';

@Component({
    selector: 'app-severity',
    templateUrl: './severity.component.html',
    styleUrls: ['./severity.component.css'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class SeverityComponent implements OnInit {
    
    public companyId: number;
    public industry: string;
    public searchType: string;
    public revenueRange: string;

    public severityInput: SeverityInput;

    constructor(private severityService: SeverityService,
        private menuService: MenuService,
        private searchService: SearchService) { }

    ngOnInit() {
        this.menuService.breadCrumb = 'Severity';
        this.buildCommonInput();
    }

    buildCommonInput() {       
        this.severityInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        };
    }

}
