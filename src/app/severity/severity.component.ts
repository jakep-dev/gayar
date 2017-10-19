import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { SeverityService, SearchService, MenuService } from 'app/services/services';
import { SeverityInput } from '../model/model';
import { SeverityDataModel, SeverityDataResponseModel } from 'app/model/model';

@Component({
    selector: 'app-severity',
    templateUrl: './severity.component.html',
    styleUrls: ['./severity.component.css'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})

export class SeverityComponent implements OnInit {

    peerGroupTable: Array<SeverityDataModel>;
    companyLossesTable: Array<SeverityDataModel>;

    columnsKeys = ['company_name', 'type_of_incident', 'incident_date_formatted', 'records_affected', 'type_of_loss', 'case_description'];
    hearderColumns = ['Company Name', 'Type of Incident', 'Incident Date', 'Records Affected', 'Type of Loss'];

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
        this.companyId = (this.searchService.selectedCompany && this.searchService.selectedCompany.companyId) ? this.searchService.selectedCompany.companyId : null;
        this.industry = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription) ? this.searchService.searchCriteria.industry.naicsDescription : null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay) ? this.searchService.searchCriteria.revenue.rangeDisplay : null;
        this.loadSeverityDataTable();
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

    loadSeverityDataTable() {
        console.log('###########################################');
        console.log('this.companyId: ' + this.companyId);
        console.log('this.industry: ' + this.industry);
        console.log('this.revenueRange: ' + this.revenueRange);
        console.log('###########################################');
        this.severityService.getSeverityDataTable(this.companyId, this.industry, this.revenueRange).subscribe((res: SeverityDataResponseModel) => {
            this.peerGroupTable = res.peerGroup;
            if (res.company != null && res.company.length > 0) {
                this.companyLossesTable = res.company;
            }
        });
    }
}
