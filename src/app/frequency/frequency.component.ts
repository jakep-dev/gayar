import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';
import { FrequencyService, SearchService, MenuService } from 'app/services/services';
import { FrequencyInput, FrequencyDataModel, FrequencyDataResponseModel } from 'app/model/model';

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

    constructor(private frequencyService: FrequencyService,
        private menuService: MenuService,
        private searchService: SearchService) { }

    ngOnInit() {
        this.menuService.breadCrumb = 'Frequency';
        this.setupTileButtons();
        this.setupTableDefinitions();
        this.loadFrequencyDataTable();
        this.buildCommonInput();
    }
    
    setupTileButtons() {
        this.isIncidentShowFlip = true;
        this.isIncidentShowSplit= true;
        this.isLossShowFlip = true;
        this.isLossShowSplit = true;
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

}
