import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { FrequencyService, SearchService, MenuService, SessionService } from 'app/services/services';
import { FrequencyInput, FrequencyDataModel, FrequencyDataResponseModel } from 'app/model/model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-frequency',
    templateUrl: './frequency.component.html',
    styleUrls: ['./frequency.component.css'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class FrequencyComponent implements OnInit {
    
    public peerGroupTable: Array<FrequencyDataModel>;
    public companyLossesTable: Array<FrequencyDataModel>;
    public columnsKeys: Array<string>;
    public headerColumns: Array<string>;
    public columnsHAlignment: Array<string>;
    public columnsWidth: Array<string>;
    public isIncidentShowFlip: boolean;
    public isIncidentShowSplit: boolean;
    public isLossShowFlip: boolean;
    public isLossShowSplit: boolean;
    public frequencyInput: FrequencyInput;

    public showLossPie: boolean;
    public showIncidentPie: boolean;

    public incidentChartView: string;    
    public lossChartView: string;  
    public isTimePeriod: boolean;
    public isIncident: boolean;
    public isLoss: boolean;
    public isPeerGroupTable: boolean;
    public isCompanyTable: boolean;
    public isPeerGroupTableHasDescriptionAccess: boolean = false;
    public isCompanyTableHasDescriptionAccess: boolean = false;

    constructor(public frequencyService: FrequencyService,
        public menuService: MenuService,
        private sessionService: SessionService,
        private searchService: SearchService,
        private router: Router) { }

    ngOnInit() {
        this.menuService.breadCrumb = 'Frequency';
        this.checkPermission();
        this.setupTileButtons();
        this.setupTableDefinitions();
        this.loadFrequencyDataTable();
        this.setupChartPermission();
        this.buildCommonInput();
    }    

    checkPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission && permission.frequency && (!permission.frequency.hasAccess)) {
            this.router.navigate(['/noAccess']);
        }
    }
    
    setupTileButtons() {
        this.isIncidentShowFlip = true;
        this.isIncidentShowSplit= true;
        this.isLossShowFlip = true;
        this.isLossShowSplit = true;
        this.incidentChartView = 'main';     
        this.lossChartView = 'main';
        
    }

    setupTableDefinitions() {
        this.columnsKeys = ['company_name', 'type_of_incident', 'incident_date_formatted', 'records_affected', 'type_of_loss', 'case_description'];
        this.headerColumns = ['Company Name', 'Type of Incident', 'Incident Date', 'Records Affected', 'Type of Loss'];
        this.columnsHAlignment = ['left', 'left', 'center', 'center', 'left'];
        this.columnsWidth = ['20%', '20%', '20%', '20%', '20%'];
    }

    loadFrequencyDataTable() {
        this.frequencyService.getFrequencyDataTable(this.searchService.getCompanyId,
            this.searchService.getNaics,
            this.searchService.getRevenueRange)
            .subscribe((res: FrequencyDataResponseModel) => {
                this.peerGroupTable = res.peerGroup;
                if (res.company != null && res.company.length > 0) {
                    this.companyLossesTable = res.company;
                }
        });
    }
    
    buildCommonInput() {
        this.frequencyInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        };
    }

    setupChartPermission() {
        let permission = this.sessionService.getUserPermission();
        if(permission) {
            this.isTimePeriod = permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasAccess;
            this.isIncident = permission.frequency && permission.frequency.incident && permission.frequency.incident.hasAccess;
            this.isLoss = permission.frequency && permission.frequency.loss && permission.frequency.loss.hasAccess;
            this.isPeerGroupTable = permission.frequency && permission.frequency.peerGroupTable && permission.frequency.peerGroupTable.hasAccess;
            this.isCompanyTable = permission.frequency && permission.frequency.companyTable && permission.frequency.companyTable.hasAccess;
            this.isPeerGroupTableHasDescriptionAccess = permission.frequency.peerGroupTable.hasDescriptionAccess;
            this.isCompanyTableHasDescriptionAccess = permission.frequency.companyTable.hasDescriptionAccess;
        }        
    }
}
