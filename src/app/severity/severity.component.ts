import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { SeverityService, SearchService, MenuService, SessionService, FrequencyService} from 'app/services/services';
import { SeverityInput } from '../model/model';
import { SeverityDataModel, SeverityDataResponseModel } from 'app/model/model';
import { Router } from '@angular/router';

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
    public incidentChartView: string;    
    public lossChartView: string;    


    public isTimePeriod: boolean;
    public isIncident: boolean;
    public isLoss: boolean;
    public isPeerGroupTable: boolean;
    public isCompanyTable: boolean;
    public isPeerGroupTableHasDescriptionAccess: boolean;
    public isCompanyTableHasDescriptionAccess: boolean;

    constructor(private severityService: SeverityService,
        public menuService: MenuService,
        private sessionService: SessionService,
        private searchService: SearchService,
        private router: Router) { }

    ngOnInit() {
        this.menuService.breadCrumb = 'Severity';
        this.checkPermission();
        this.buildCommonInput();
        this.setupTableDefinitions();
        this.loadSeverityDataTable();
        this.setupChartPermission();
        this.incidentChartView = 'main';                
        this.lossChartView = 'main';                
    }

    checkPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission && permission.severity && (!permission.severity.hasAccess)) {
            this.router.navigate(['/noAccess']);
        }
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
    
    setupChartPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission) {
            this.isTimePeriod = permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasAccess;
            this.isIncident = permission.severity && permission.severity.incident && permission.severity.incident.hasAccess;
            this.isLoss = permission.severity && permission.severity.loss && permission.severity.loss.hasAccess;
            this.isPeerGroupTable = permission.severity && permission.severity.peerGroupTable && permission.severity.peerGroupTable.hasAccess;
            this.isCompanyTable = permission.severity && permission.severity.companyTable && permission.severity.companyTable.hasAccess;
            this.isPeerGroupTableHasDescriptionAccess = permission.severity.peerGroupTable.hasDescriptionAccess;
            this.isCompanyTableHasDescriptionAccess = permission.severity.companyTable.hasDescriptionAccess;
        }
    }
}
