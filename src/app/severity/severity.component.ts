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

    public peerGroupTable: Array<SeverityDataModel>;
    public companyLossesTable: Array<SeverityDataModel>;
    public columnsKeys: Array<string>;
    public headerColumns: Array<string>;
    public columnsHAlignment: Array<string>;
    public columnsWidth: Array<string>;
    public severityInput: SeverityInput;

    public showLossPie: boolean;
    public showIncidentPie: boolean;

    constructor(private severityService: SeverityService,
        public menuService: MenuService,
        private searchService: SearchService) { }

    ngOnInit() {
        this.menuService.breadCrumb = 'Severity';
        this.buildCommonInput();
        this.setupTableDefinitions();
        this.loadSeverityDataTable();
    }

    buildCommonInput() {
        this.severityInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        };
    }

    setupTableDefinitions() {
        this.columnsKeys = ['company_name', 'type_of_incident', 'incident_date_formatted', 'records_affected', 'type_of_loss', 'case_description'];
        this.headerColumns = ['Company Name', 'Type of Incident', 'Incident Date', 'Records Affected', 'Type of Loss'];
        this.columnsHAlignment = ['left', 'left', 'center', 'center', 'left'];
        this.columnsWidth = ['20%', '20%', '20%', '20%', '20%'];
    }

    loadSeverityDataTable() {
        this.severityService.getSeverityDataTable(this.searchService.getCompanyId, this.searchService.getNaics, this.searchService.getRevenueRange).subscribe((res: SeverityDataResponseModel) => {
            this.peerGroupTable = res.peerGroup;
            if (res.company != null && res.company.length > 0) {
                this.companyLossesTable = res.company;
            }
        });
    }
}
