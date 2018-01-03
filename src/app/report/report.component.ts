import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { DatePipe } from '@angular/common';

import { BenchmarkComponent as Dashboard_BenchmarkComponent, BenchmarkComponent } from 'app/dashboard/benchmark/benchmark.component';
import { FrequencyComponent as Dashboard_FrequencyComponent } from 'app/dashboard/frequency/frequency.component';
import { SeverityComponent as Dashboard_SeverityComponent } from 'app/dashboard/severity/severity.component';

import { IndustryOverviewComponent as Frequency_IndustryOverviewComponent } from 'app/frequency/industry-overview/industry-overview.component';
import { TimePeriodComponent as Frequency_TimePeriodComponent } from 'app/frequency/time-period/time-period.component';
import { IncidentBarComponent as Frequency_IncidentBarComponent } from 'app/frequency/incident-bar/incident-bar.component';
import { IncidentPieComponent as Frequency_IncidentPieComponent } from 'app/frequency/incident-pie/incident-pie.component';
import { LossBarComponent as Frequency_LossBarComponent } from 'app/frequency/loss-bar/loss-bar.component';
import { LossPieComponent as Frequency_LossPieComponent } from 'app/frequency/loss-pie/loss-pie.component';

import { IndustryOverviewComponent as Severity_IndustryOverviewComponent } from 'app/severity/industry-overview/industry-overview.component';
import { TimePeriodComponent as Severity_TimePeriodComponent } from 'app/severity/time-period/time-period.component';
import { IncidentBarComponent as Severity_IncidentBarComponent } from 'app/severity/incident-bar/incident-bar.component';
import { IncidentPieComponent as Severity_IncidentPieComponent } from 'app/severity/incident-pie/incident-pie.component';
import { LossBarComponent as Severity_LossBarComponent } from 'app/severity/loss-bar/loss-bar.component';
import { LossPieComponent as Severity_LossPieComponent } from 'app/severity/loss-pie/loss-pie.component';

import { LimitComponent as Benchmark_LimtComponent } from 'app/benchmark/limit/limit.component';
import { PeerGroupLossComponent as Benchmark_PeerGroupLossComponent } from 'app/benchmark/peer-group-loss/peer-group-loss.component';
import { PremiumComponent as Benchmark_PremiumComponent } from 'app/benchmark/premium/premium.component';
import { RateComponent as Benchmark_RateComponent} from 'app/benchmark/rate/rate.component';
import { RetentionComponent as Benchmark_RetentionComponent} from 'app/benchmark/retention/retention.component';

import { MenuService, SearchService, 
    FrequencyService, SeverityService, 
    ReportService, FontService, GetFileService  ,
    SessionService
} from 'app/services/services';

import { 
    DashboardScore, 
    FrequencyInput, FrequencyDataModel, FrequencyDataResponseModel,
    SeverityInput, SeverityDataModel, SeverityDataResponseModel,
    BenchmarkDistributionInput, BenchmarkLimitAdequacyInput, BenchmarkRateInput, ComponentPrintSettings,
    IReportTileModel, ISubComponentModel, IChartMetaData, IChartWidget, IGlossaryTermModel
} from 'app/model/model';

import { 
    BasePage, CoverPage, TOCPage, DashboardPage,
    FrequencyIndustryOverviewPage, FrequencyTimePeriodPage, FrequencyTypeOfIncidentPage, 
    FrequencyDataPrivacyPage, FrequencyNetworkSecurityPage, FrequencyTechEOPage, 
    FrequencyPrivacyViolationsPage, FrequencyTypeOfLossPage, FrequencyPersonalInformationPage, 
    FrequencyCorporateLossesPage,
    
    SeverityIndustryOverviewPage, SeverityTimePeriodPage, SeverityTypeOfIncidentPage,
    SeverityDataPrivacyPage, SeverityNetworkSecurityPage, SeverityTechEOPage,
    SeverityPrivacyViolationsPage, SeverityTypeOfLossPage, SeverityPersonalInformationPage,
    SeverityCorporateLossesPage,

    BenchmarkPage, 
    FrequencyMostRecentPeerGroupLossesPage, FrequencyMostRecentCompanyLossesPage,
    SeverityTopPeerGroupLossesPage, SeverityTopCompanyLossesPage,
    GlossaryPage
} from 'app/pdf-download/pages/pages'

import { PDFMakeBuilder } from 'app/pdf-download/pdfMakeBuilder';

import { BaseChart } from 'app/shared/charts/base-chart';
import { canvasFactory } from 'app/shared/pdf/pdfExport';
import { getPdfMake } from 'app/shared/pdf/pdfExport';
import { APPCONSTANTS } from 'app/app.const';

@Component({
    selector: 'app-report',
    templateUrl: 'report.component.html',
    styleUrls: ['./report.component.scss'],
    entryComponents: [
        Dashboard_BenchmarkComponent, 
        Dashboard_FrequencyComponent, 
        Dashboard_SeverityComponent,

        Frequency_IndustryOverviewComponent,
        Frequency_TimePeriodComponent,
        Frequency_IncidentBarComponent,
        Frequency_IncidentPieComponent,
        Frequency_LossBarComponent,
        Frequency_LossPieComponent,

        Severity_IndustryOverviewComponent,
        Severity_TimePeriodComponent,
        Severity_IncidentBarComponent,
        Severity_IncidentPieComponent,
        Severity_LossBarComponent,
        Severity_LossPieComponent,

        Benchmark_LimtComponent,
        Benchmark_PeerGroupLossComponent,
        Benchmark_PremiumComponent,
        Benchmark_RateComponent,
        Benchmark_RetentionComponent
    ]
})
export class ReportComponent implements OnInit {

    //list of high level report sections
    public reportTileModel: Array<IReportTileModel> = null;

    //list of high level report sections
    public reportGlossaryModel: Array<IGlossaryTermModel> = null;

    //associate array that maps page type to page object
    private pageCollection: Array<BasePage> = [];
    
    //list of  page type names
    private pageOrder: Array<string> = [];

    //list of chart data objects
    private chartDataCollection: Array<IChartMetaData> = [];
    
    //indicate the number of chart objects processed
    private chartLoadCount: number;

    //indicate the number of pages processed
    private pagesProcessedCount: number;

    //The insertion point for the dynamic loading of chart components
    @ViewChild('entryPoint', { read: ViewContainerRef }) entryPoint: ViewContainerRef;
    
    //The html canvas object used to convert svg to png data url
    @ViewChild('canvas') canvas: ElementRef;

    private searchType: string;
    private companyId: number;
    private naics: string;
    private revenueRange: string;

    //input to dashboard charts
    private getDashboardScoreByManualInput: DashboardScore;

    //input to frequency charts
    private frequencyInput: FrequencyInput;

    //input to frequency most recent peer group losses table
    private frequencyPeerGroupTable: Array<FrequencyDataModel>;
    
    //input to frequency most recent company losses table
    private frequencyCompanyLossesTable: Array<FrequencyDataModel>;
    
    //input to severity charts
    private severityInput: SeverityInput;

    //input to severity top peer group losses table
    private severityPeerGroupTable: Array<SeverityDataModel>;

    //input to severity top company losses table
    private severityCompanyLossesTable: Array<SeverityDataModel>;

    //input for limit, premium and retention benchmark charts
    private benchmarkDistributionInput: BenchmarkDistributionInput;
    
    //input for peer group loss benchmark chart
    private benchmarkLimitAdequacyInput: BenchmarkLimitAdequacyInput;

    //input for rate benchmark chart
    private benchmarkRateInput: BenchmarkRateInput;

    //print settings for the current chart being processed
    private printSettings: ComponentPrintSettings;
    
    //Reference to the HighChart object
    private chart: BaseChart;

    //Object used to generate PDF
    private pdfMake: any;

    //Object used to assemble the final json object for pdfmake library
    private pdfBuilder: PDFMakeBuilder;

    //filename of the pdf download
    //Cyber OverVue Report_' + Company Name + '_' + 'MMDDYYYY' + '.pdf'
    private pdfFilename: string;

    private coverPage: CoverPage;
    private tocPage: TOCPage;

    //boolean to indicate report data is loaded
    private reportDataDone: boolean = false;
    //boolean to indicate report glossary data is loaded
    private reportGlossaryDataDone: boolean = false;
    //boolean to indicate frequency data is loaded
    private frequencyDataDone: boolean = false;
    //boolean to indicate severity data is loaded
    private severityDataDone: boolean = false;

    constructor(
        private rootElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private fontService: FontService,
        private getFileService: GetFileService,
        private menuService: MenuService,
        private searchService: SearchService,
        private frequencyService: FrequencyService,
        private severityService: SeverityService,
        private reportService: ReportService,
        private sessionService: SessionService) {

        //If font files are not loaded setup the call back function to catch the event when font files are loaded
        if(this.fontService.isLoadComplete()) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
            console.log('Font files already loaded!');
        } else {
            this.fontService.loadCompleted$.subscribe(this.configurePDFMake.bind(this));
        }

        this.pdfBuilder = new PDFMakeBuilder();

        //Create cover page
        this.coverPage = new CoverPage();
        this.coverPage.setFileService(this.getFileService);

        //Create table of contents page
        this.tocPage = new TOCPage();
    }

    /**
     * Callback function to indicate the font files for pdf generation is loaded
     * 
     * @private
     * @function configurePDFMake
     * @param {boolean} isReady - indicate where the font files are loaded
     * @return {} - No return types.
     */
    private configurePDFMake(isReady: boolean) {
        if(isReady) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
            console.log('Font files loaded!');
        }
    }

    /**
     * ngOnInit - Fires on initial load and loads the
     * 
     * @return {} - No return types.
     */
    ngOnInit() {
        this.menuService.breadCrumb = 'Report';
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null; 

        //set cover page's company name, industry name and revenue range labels
        this.coverPage.setCompanyName((this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) ? this.searchService.selectedCompany.companyName : this.searchService.searchCriteria.value);
        if(this.naics) {
            this.coverPage.setIndustryName(this.naics);
        }
        if(this.revenueRange) {
            this.coverPage.setRevenueRangeText(this.revenueRange);
        }

        let dp = new DatePipe('en-US');
        this.pdfFilename = 'Cyber OverVue Report_' + this.coverPage.getCompanyName() + '_' + dp.transform(new Date(), 'MMddyyyy') + '.pdf';

        //Get logged in user's company name
        //this.coverPage.setUserCompanyName('Advisen');
        this.searchService.checkForRevenueAndIndustry(0).subscribe((data)=>{
            if(data && data.message){
                this.coverPage.setUserCompanyName(data.companyName);
            }
        });
        
        //initialize chart input objects
        this.setupChartInput();
        //Call report service to get report structure
        this.getReportConfig();
        //Call report glossart service to get glossart structure
        this.getReportGlossaryConfig();
        //Call frequecy service to get frequency table data
        this.getFrequencyTables();
        //Call severity service to get severity table data
        this.getSeverityTables();
    }

    /**
     * Setup chart component input objects used to instantiate chart components
     * 
     * @private
     * @function setupChartInput
     * @return {} - No return types.
     */
    private setupChartInput() {
        this.searchType = this.searchService.searchCriteria.type;
        if (this.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.companyId = this.searchService.selectedCompany.companyId;
        } else {
            this.companyId = null;
        }

        this.getDashboardScoreByManualInput = {
            searchType: this.searchType,
            chartType: 'BENCHMARK',
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange,
            limit : this.searchService.searchCriteria.limit,
            retention: this.searchService.searchCriteria.retention,
        };

        this.frequencyInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        };

        this.severityInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        };

        this.benchmarkDistributionInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            premiumValue: this.searchService.getPremium,
            limitValue: this.searchService.getLimit,
            retentionValue: this.searchService.getRetention,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRange
        }

        this.benchmarkLimitAdequacyInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            limits: this.searchService.getLimit,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRangeId
        };

        this.benchmarkRateInput = {
            searchType: this.searchService.getSearchType,
            companyId: this.searchService.getCompanyId,
            premiumValue: this.searchService.getPremium,
            limitValue: this.searchService.getLimit,
            naics: this.searchService.getNaics,
            revenueRange: this.searchService.getRevenueRangeId
        };
    }

    /**
     * getReportConfig - Load the report configuration.
     *
     * @private
     * @function getReportConfig
     * @return {} - No return types.
     */
    private getReportConfig () {
        this.reportService.getReportConfig().subscribe((data)=> {
            this.reportTileModel = data;
            this.buildReportPermission();
            console.log('Report Data Done!');
            this.reportDataDone = true;
        });
    }

    /**
     * buildReportPermission - build the report permission 
     * 
     * @private
     * @function buildReportPermission
     * return {} - No return types
     */
    private buildReportPermission() {
        this.reportTileModel.forEach( reportComponent => {
            reportComponent.hasAccess = this.getPageAccess(reportComponent.id);
            reportComponent.value = reportComponent.hasAccess;
            if(reportComponent.subComponents && reportComponent.subComponents.length > 0) {
                reportComponent.subComponents.forEach( reportSubComponent => {
                    reportSubComponent.hasAccess = (reportComponent.hasAccess)? this.getComponentAccess(reportSubComponent.id) : false;
                    reportSubComponent.value = reportSubComponent.hasAccess;
                    if(reportSubComponent.chartComponents && reportSubComponent.chartComponents.length > 0) {
                        reportSubComponent.chartComponents.forEach(chartMetdata => 
                            {
                                chartMetdata.hasAccess = this.getChartAccess(chartMetdata.id)
                            }
                        );
                    }
                    if(reportSubComponent.subSubComponents && reportSubComponent.subSubComponents.length > 0) {
                        reportSubComponent.subSubComponents.forEach ( chartDetails => {
                            chartDetails.hasAccess = (reportSubComponent.hasAccess)? this.getChartDetailAccess(reportSubComponent.id): false;
                            chartDetails.value = chartDetails.hasAccess;
                            if(chartDetails.chartComponents && chartDetails.chartComponents.length > 0) {
                                chartDetails.chartComponents.forEach(chartMetadata =>
                                    {
                                        chartMetadata.hasAccess = this.getChartAccess(chartMetadata.id);
                                    }
                                );
                            }
                        });
                    }
                });
            }
        });
    }

    /**
     * getPageAccess - get the page access
     * 
     * @private
     * @function getPageAccess
     * @param id - id of the page
     * @return {boolean} - true if the page has access, otherwise false
     */
    private getPageAccess(id:string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {
            case APPCONSTANTS.REPORTS_ID.dashboardPage:
                return permission && permission.dashboard && permission.dashboard.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyPage:
                return permission && permission.frequency && permission.frequency.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityPage:
                return permission && permission.severity && permission.severity.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkPage:
                return permission && permission.benchmark && permission.benchmark.hasAccess;
            case APPCONSTANTS.REPORTS_ID.appendixPage:
                return permission && permission.glossary && permission.glossary.hasAccess;
            default:
                return false;
        }
    }

    /**
     * getComponentAccess - get the component access
     * 
     * @private
     * @function getComponentAccess
     * @param id - id of the component
     * @return {boolean} - true if the component has access, otherwise false
     */
    private getComponentAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {

            //dashboard components
            case APPCONSTANTS.REPORTS_ID.frequencyGauge:
                return permission && permission.dashboard && permission.dashboard.frequencyGauge && permission.dashboard.frequencyGauge.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityGauge:
                return permission && permission.dashboard && permission.dashboard.severityGauge && permission.dashboard.severityGauge.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkGauge:
                return permission && permission.dashboard && permission.dashboard.benchmarkGauge && permission.dashboard.benchmarkGauge.hasAccess;

            //frequency components
            case APPCONSTANTS.REPORTS_ID.frequencyIndustry:
                return permission && permission.frequency && permission.frequency.industry && permission.frequency.industry.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriod:
                return permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyIncident:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyLoss:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyPeerLosses:
                return permission && permission.frequency && permission.frequency.peerGroupTable && permission.frequency.peerGroupTable.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyCompanyLosses:
                return permission && permission.frequency && permission.frequency.companyTable && permission.frequency.companyTable.hasAccess;
            
            //severity components
            case APPCONSTANTS.REPORTS_ID.severityIdustry:
                return permission && permission.severity && permission.severity.industry && permission.severity.industry.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityTimePeriod:
                return permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityIncident:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityLoss:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityPeerLosses:
                return permission && permission.severity && permission.severity.peerGroupTable && permission.severity.peerGroupTable.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityCompanyLosses:
                return permission && permission.severity && permission.severity.companyTable && permission.severity.companyTable.hasAccess;
            
            //benchmark components
            case APPCONSTANTS.REPORTS_ID.benchmarkLimitAdequacy:
                return permission && permission.severity && permission.benchmark.limitAdequacy && permission.benchmark.limitAdequacy.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkPremium:
                return permission && permission.severity && permission.benchmark.premium && permission.benchmark.premium.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkLimit:
                return permission && permission.severity && permission.benchmark.limit && permission.benchmark.limit.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRetention:
                return permission && permission.severity && permission.benchmark.retention && permission.benchmark.retention.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRate:
                return permission && permission.severity && permission.benchmark.rate && permission.benchmark.rate.hasAccess;

            //glossary
            case APPCONSTANTS.REPORTS_ID.glossary:
                return permission && permission.glossary && permission.glossary && permission.glossary.hasAccess;

            default: 
                return false;
        }
    }

    /**
     * getChartDetailAccess - get the chart detail access
     * 
     * @private
     * @function getChartDetailAccess
     * @param id - id of the chart detail
     * @return {boolean} - true if the chart detail has access, otherwise false
     */
    private getChartDetailAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {

            //frequency detailed charts
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriodDetails:
                return permission && permission.frequency && permission.frequency.timePeriod.hasAccess && permission.frequency.timePeriod.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyIncident:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyLoss:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasDetailAccess;
            
            //severity detailed charts
            case APPCONSTANTS.REPORTS_ID.severityTimePeriodDetails:
                return permission && permission.severity && permission.severity.timePeriod.hasAccess && permission.severity.timePeriod.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.severityIncident:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasDetailAccess;
            case APPCONSTANTS.REPORTS_ID.severityLoss:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasDetailAccess;
            
            default: 
                return false;
        }
    }

    /**
     * getTableDetailAccess - get the table row detail access
     * 
     * @private
     * @function getTableDetailAccess
     * @param id - id of the table detail
     * @return {boolean} - true if the table row detail has access, otherwise false
     */
    private getTableDetailAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {

            //frequency detailed tables
            case APPCONSTANTS.REPORTS_ID.frequencyCompanyLossesDetails:
                return permission && permission.frequency && permission.frequency.companyTable && permission.frequency.companyTable.hasAccess && permission.frequency.companyTable.hasDescriptionAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyPeerLossesDetails:
                return permission && permission.frequency && permission.frequency.peerGroupTable && permission.frequency.peerGroupTable.hasAccess && permission.frequency.peerGroupTable.hasDescriptionAccess;
            
            //severity detailed tables
            case APPCONSTANTS.REPORTS_ID.severityCompanyLossesDetails:
                return permission && permission.severity && permission.severity.companyTable && permission.severity.companyTable.hasAccess && permission.severity.companyTable.hasDescriptionAccess;
            case APPCONSTANTS.REPORTS_ID.severityPeerLossesDetails:
                return permission && permission.severity && permission.severity.peerGroupTable && permission.severity.peerGroupTable.hasAccess && permission.severity.peerGroupTable.hasDescriptionAccess;
            
            default: 
                return false;
        }
    }

    /**
     * getChartAccess - get the chart access
     * 
     * @private
     * @function getChartAccess
     * @param id - id of the chart
     * @return {boolean} - true if the chart is rendered, otherwise false
     */
    private getChartAccess(id: string) {
        let permission = this.sessionService.getUserPermission();
        switch(id) {
            //dashboard page charts
            case APPCONSTANTS.REPORTS_ID.frequencyGaugeChart:
                return permission && permission.dashboard && permission.dashboard.frequencyGauge && permission.dashboard.frequencyGauge.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityGaugeChart:
                return permission && permission.dashboard && permission.dashboard.severityGauge && permission.dashboard.severityGauge.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkGaugeChart:
                return permission && permission.dashboard && permission.dashboard.benchmarkGauge && permission.dashboard.benchmarkGauge.hasAccess;

            //frequency industry overview page chart
            case APPCONSTANTS.REPORTS_ID.frequencyIndustryChart:
                return permission && permission.frequency && permission.frequency.industry && permission.frequency.industry.hasAccess;
            
            //frequency time period page charts
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriodChart:
                return permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.frequencyTimePeriodDetails:
                return permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasDetailAccess;
            
            //frequency type of incident overview page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentPieChart:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasAccess;
            
            //frequency type of incident data privacy page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentDataBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentDataPieChart:
            //frequency type of incident network security page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentNetworkDataBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentNetworkPieChart:
            //frequency type of incident tech e&o page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentTechBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentTechPieChart:
            //frequency type of incident privacy violations page charts
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentPrivacyBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyIncidentPrivacyPieChart:
                return permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasDetailAccess;

            //frequency type of loss overview page charts
            case APPCONSTANTS.REPORTS_ID.frequencyLossBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyLossPieChart:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasAccess;

            //frequency type of loss personal information page charts
            case APPCONSTANTS.REPORTS_ID.frequencyLossPersonalBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyLossPersonalPieChart:
            //frequency type of loss corporate losses page charts
            case APPCONSTANTS.REPORTS_ID.frequencyLossCorporateBarChart:
            case APPCONSTANTS.REPORTS_ID.frequencyLossCorporatePieChart:
                return permission && permission.frequency && permission.frequency.loss && permission.frequency.loss.hasDetailAccess

            //severity industry overview page chart
            case APPCONSTANTS.REPORTS_ID.severityIdustryChart:
                return permission && permission.severity && permission.severity.industry && permission.severity.industry.hasAccess;

            //severity time period page charts
            case APPCONSTANTS.REPORTS_ID.severityTimePeriodChart:
                return permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasAccess;
            case APPCONSTANTS.REPORTS_ID.severityTimePeriodDetails:
                return permission && permission.severity && permission.severity.timePeriod && permission.severity.timePeriod.hasDetailAccess;

            //severity type of incident overview page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentPieChart:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasAccess;

            //severity type of incident data privacy page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentDataBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentDataPieChart:
            //severity type of incident network security page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentNetworkDataBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentNetworkPieChart:
            //severity type of incident tech e&o page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentTechBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentTechPieChart:
            //severity type of incident privacy violations page charts
            case APPCONSTANTS.REPORTS_ID.severityIncidentPrivacyBarChart:
            case APPCONSTANTS.REPORTS_ID.severityIncidentPrivacyPieChart:
                return permission && permission.severity && permission.severity.incident && permission.severity.incident.hasDetailAccess;

            //severity type of loss overview page charts
            case APPCONSTANTS.REPORTS_ID.severityLossBarChart:
            case APPCONSTANTS.REPORTS_ID.severityLossPieChart:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasAccess;

            //severity type of loss personal information page charts
            case APPCONSTANTS.REPORTS_ID.severityLossPersonalBarChart:
            case APPCONSTANTS.REPORTS_ID.severityLossPersonalPieChart:
            //severity type of loss corporate losses page charts
            case APPCONSTANTS.REPORTS_ID.severityLossCorporateBarChart:
            case APPCONSTANTS.REPORTS_ID.severityLossCorporatePieChart:
                return permission && permission.severity && permission.severity.loss && permission.severity.loss.hasDetailAccess;

            //benchmark page charts
            case APPCONSTANTS.REPORTS_ID.benchmarkLimitAdequacyChart:
                return permission && permission.severity && permission.benchmark.limitAdequacy && permission.benchmark.limitAdequacy.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkPremiumChart:
                return permission && permission.severity && permission.benchmark.premium && permission.benchmark.premium.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkLimitChart:
                return permission && permission.severity && permission.benchmark.limit && permission.benchmark.limit.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRetentionChart:
                return permission && permission.severity && permission.benchmark.retention && permission.benchmark.retention.hasAccess;
            case APPCONSTANTS.REPORTS_ID.benchmarkRateChart:
                return permission && permission.severity && permission.benchmark.rate && permission.benchmark.rate.hasAccess;
            default: 
                return false;
        }
    }


    /**
     * getReportConfig - Load the report configuration.
     *
     * @private
     * @function getReportConfig
     * @return {} - No return types.
     */
    private getReportGlossaryConfig () {
        this.reportService.getReportGlossaryConfig().subscribe((data)=> {
            this.reportGlossaryModel = data;
            console.log('Report Glossary Data Done!');
            this.reportGlossaryDataDone = true;
        });
    }

    /**
     * Get frequency table data for 
     * Most Recent Peer Group Losses and Most Recent Company Losses sections
     * 
     * @private
     * @function getFrequencyTables
     * @return {} - No return types.
     */
    private getFrequencyTables() {
        this.frequencyService.getFrequencyDataTable(this.searchService.getCompanyId,
            this.searchService.getNaics,
            this.searchService.getRevenueRange)
            .subscribe((res: FrequencyDataResponseModel) => {
                this.frequencyPeerGroupTable = res.peerGroup;
                if (res.company != null && res.company.length > 0) {
                    this.frequencyCompanyLossesTable = res.company;
                }
                console.log('Frequency Data Done!');
                this.frequencyDataDone = true;
        });        
    }

    /**
     * Get severity table data for 
     * Top Peer Group Losses and Top Company Losses sections
     * 
     * @private
     * @function getSeverityTables
     * @return {} - No return types.
     */
    private getSeverityTables() {
        this.severityService.getSeverityDataTable(this.searchService.getCompanyId, this.searchService.getNaics, this.searchService.getRevenueRange).subscribe((res: SeverityDataResponseModel) => {
            this.severityPeerGroupTable = res.peerGroup;
            if (res.company != null && res.company.length > 0) {
                this.severityCompanyLossesTable = res.company;
            }
            console.log('Severity Data Done!');
            this.severityDataDone = true;
        });
    }

    /**
     * Clears the contents of the input array 
     * Array can be an associative array or regular array
     * 
     * @private
     * @function clearArray
     * @param {Array<any>} array - arbitrary array
     * @return {} - No return types.
     */
    private clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            console.log('Deleting key ' + item);
            delete array[item];
        }
    }

    /**
     * Response to the download report button
     * Continuosly wait for all resources and data are loaded before starting the pdf generation process
     * 
     * @public
     * @function onReport
     * @return {} - No return types.
     */
    public onReport () {
        //check if the pdf fonts are loaded
        //check if cover page image is loaded
        //check if report data is loaded
        //check if report glossary data is loaded
        //check if frequency table data is loaded
        //check if severity table data is loaded
        if(this.pdfMake && this.coverPage.isCoverPageLoaded() && this.reportDataDone && this.reportGlossaryDataDone 
            && this.frequencyDataDone && this.severityDataDone) {
            this.startReportProcess();
        } else {
            console.log('Waiting for resources to load before starting report.');
            setTimeout(this.onReport.bind(this), 1000);
        }

    }

    /**
     * Process one high level report section at a time by calling processReportSection
     * Start processing chart images serially.
     * If no chart image are selected, we need to start page count procesing
     * 
     * @private
     * @function startReportProcess
     * @return {} - No return types.
     */
    private startReportProcess() {
        this.chartLoadCount = 0;
        this.pagesProcessedCount = 0;
        this.chartDataCollection.length = 0;
        this.pageOrder.length = 0;
        this.clearArray(this.pageCollection);
        this.tocPage.clearTOC();
        this.reportTileModel.forEach(reportSection => {
            if(reportSection.value) {
                this.processReportSection(reportSection);
            }
        });
        //console.log(this.chartDataCollection);
        //Start processing of chart images
        if(this.chartDataCollection.length > 0) {
            this.loadChartImage();
        } else if(this.pageOrder.length > 0) {
            //if no chart images the start the page count processing
            this.processPageCounts();
        }
    }

    /**
     * Add page object's chart components to chartDataCollection.  If the chart 
     * component's page type is not loaded yet then create 
     * instance of the specified page type.  
     * 
     * @private
     * @function loadChartCollection
     * @param {IChartWidget[]} chartComponents - List of chart objects within report section or sub sectio or sub sub section
     * @param {string} pageType - The page type where the chart component resides in
     * @param {string} tocDescription - The table of contents entry for which the chart objects that is being mapped to
     * @return {} - No return types.
     */
    private loadChartCollection(chartComponents:IChartWidget[], pageType: string, tocDescription: string) {
        let n: number;
        let i: number;

        if(!this.hasPageType(pageType)) {
            this.addPageType(pageType);
            console.log('Loaded Page type ' + pageType);
        }
        if(chartComponents) {
            n = chartComponents.length;
            for(i = 0; i < n; i++) {
                if(chartComponents[i].hasAccess) {
                    this.chartDataCollection.push(
                        {
                            chartSetting: chartComponents[i],
                            imageData: '',
                            imageIndex: chartComponents[i].componentName + '_' + this.chartDataCollection.length,
                            pagePosition: chartComponents[i].pagePosition,
                            tocDescription: tocDescription,
                            targetPage: this.pageCollection[pageType]
                        }
                    );
                }
            }
        }
    }


    /**
     * Processes a single top level report section and collects 
     * information on chart component parameters and the page 
     * type the chart is rendered into by calling loadChartCollection.
     * Maintain the list table of contents entries to page type mapping
     * 
     * @private
     * @function processReportSection
     * @param {IReportTileModel} section - top level report section that may contain zero or 
     * more sub sections which may also have sub sub sections
     * @return {} - No return types.
     */
    private processReportSection(section: IReportTileModel) {
        let sectionHeaderAdded = false;
        let subEntryAdded;

        section.subComponents.forEach(subComponentItem => {
            if(subComponentItem.value) {
                if(!sectionHeaderAdded) {
                    console.log('Section = ' + section.description + ' pageType = ' + subComponentItem.pageType);
                    this.tocPage.addTocEntry(section.description, 1, subComponentItem.pageType);
                    sectionHeaderAdded = true;
                }
                console.log('Sub Component = ' + subComponentItem.description + ' pageType = ' + subComponentItem.pageType);
                this.tocPage.addTocEntry(subComponentItem.description, 2, subComponentItem.pageType);
                subEntryAdded = true;
                this.loadChartCollection(subComponentItem.chartComponents, subComponentItem.pageType, subComponentItem.description);
            } else {
                subEntryAdded = false;
            }
            if(subComponentItem.subSubComponents) {
                subComponentItem.subSubComponents.forEach(subSubComponentItem => {
                    if(subSubComponentItem.value) {
                        if(!sectionHeaderAdded) {
                            console.log('Section = ' + section.description + ' pageType = ' + subComponentItem.pageType);
                            this.tocPage.addTocEntry(section.description, 1, subComponentItem.pageType);
                            sectionHeaderAdded = true;
                        }
                        if(!subEntryAdded) {
                            console.log('Sub Component = ' + subComponentItem.description + ' pageType = ' + subComponentItem.pageType);
                            this.tocPage.addTocEntry(subComponentItem.description, 2, subComponentItem.pageType);
                            this.loadChartCollection(subComponentItem.chartComponents, subComponentItem.pageType, subComponentItem.description);
                            subEntryAdded = true;
                        }
                        console.log('Sub Sub Component = ' + subSubComponentItem.description + ' pageType = ' + subSubComponentItem.pageType);
                        this.tocPage.addTocEntry(subSubComponentItem.description, 3, subSubComponentItem.pageType);
                        this.loadChartCollection(subSubComponentItem.chartComponents, subSubComponentItem.pageType, subSubComponentItem.description);
                    }
                });
            }
            
        });
    }
    
    /**
     * Loads the next chart component from the chartDataCollection
     * Wire callback event to get underlying chart object reference
     * and trigger image conversion when svg image is rendered
     * 
     * @private
     * @function loadChartImage
     * @return {} - No return types.
     */
    private loadChartImage() {
        let componentFactory: ComponentFactory<any>;
        
        let dashboardBenchmarkGaugeComponent: Dashboard_BenchmarkComponent;
        let dashboardFrequencyGaugeComponent: Dashboard_FrequencyComponent;
        let dashboardSeverityGaugeComponent: Dashboard_SeverityComponent;

        let frequencyIndustryOverviewComponent: Frequency_IndustryOverviewComponent;
        let frequencyTimePeriodComponent: Frequency_TimePeriodComponent;
        let frequencyIncidentBarComponent: Frequency_IncidentBarComponent;
        let frequencyIncidentPieComponent: Frequency_IncidentPieComponent;
        let frequencyLossBarComponent: Frequency_LossBarComponent;
        let frequencyLossPieComponent: Frequency_LossPieComponent;

        let severityIndustryOverviewComponent: Severity_IndustryOverviewComponent;
        let severityTimePeriodComponent: Severity_TimePeriodComponent;
        let severityIncidentBarComponent: Severity_IncidentBarComponent;
        let severityIncidentPieComponent: Severity_IncidentPieComponent;
        let severityLossBarComponent: Severity_LossBarComponent;
        let severityLossPieComponent: Severity_LossPieComponent;

        let benchmarkLimitComponent: Benchmark_LimtComponent;
        let benchmarkPeerGroupLossComponent: Benchmark_PeerGroupLossComponent;
        let benchmarkPremiumComponent: Benchmark_PremiumComponent;
        let benchmarkRateComponent: Benchmark_RateComponent;
        let benchmarkRetentionComponent: Benchmark_RetentionComponent;

        //load the next chart in the chartDataCollection
        let chartData: IChartMetaData = this.chartDataCollection[this.chartLoadCount];
        //console.log('Processing page ' + chartData.targetPage.getPageType());
        //setup chart component with fixed width and height
        this.printSettings = chartData.targetPage.getPrintSettings(chartData.pagePosition);
        //setup default drilldown if any
        this.printSettings.drillDown = chartData.chartSetting.drillDownName;
        //setup canvas to have the same dimensions as the chart
        this.canvas.nativeElement.width = this.printSettings.width;
        this.canvas.nativeElement.height = this.printSettings.height;
        //clear the entry point for the dynamically loading of chart component before loading a new chart component
        this.entryPoint.clear();
        
        //load chart component based on its selector tag name and wire up the callbacks
        switch(chartData.chartSetting.componentName) {
            case 'app-dashboard-frequency':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Dashboard_FrequencyComponent);
                dashboardFrequencyGaugeComponent = <Dashboard_FrequencyComponent>this.entryPoint.createComponent(componentFactory).instance;
                dashboardFrequencyGaugeComponent.componentData = this.getDashboardScoreByManualInput;
                dashboardFrequencyGaugeComponent.printSettings = this.printSettings;
                dashboardFrequencyGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                dashboardFrequencyGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'app-dashboard-severity':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Dashboard_SeverityComponent);
                dashboardSeverityGaugeComponent = <Dashboard_SeverityComponent>this.entryPoint.createComponent(componentFactory).instance;
                dashboardSeverityGaugeComponent.componentData = this.getDashboardScoreByManualInput;
                dashboardSeverityGaugeComponent.printSettings = this.printSettings;
                dashboardSeverityGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                dashboardSeverityGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'dashboard-benchmark-score':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Dashboard_BenchmarkComponent);
                dashboardBenchmarkGaugeComponent = <Dashboard_BenchmarkComponent>this.entryPoint.createComponent(componentFactory).instance;
                dashboardBenchmarkGaugeComponent.componentData = this.getDashboardScoreByManualInput;
                dashboardBenchmarkGaugeComponent.printSettings = this.printSettings;
                dashboardBenchmarkGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                dashboardBenchmarkGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;

            case 'frequency-industry-overview':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_IndustryOverviewComponent);
                frequencyIndustryOverviewComponent = <Frequency_IndustryOverviewComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyIndustryOverviewComponent.componentData = this.frequencyInput;
                frequencyIndustryOverviewComponent.printSettings = this.printSettings;
                frequencyIndustryOverviewComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyIndustryOverviewComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-time-period':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_TimePeriodComponent);
                frequencyTimePeriodComponent = <Frequency_TimePeriodComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyTimePeriodComponent.componentData = this.frequencyInput;
                frequencyTimePeriodComponent.printSettings = this.printSettings;
                frequencyTimePeriodComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyTimePeriodComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-incident-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_IncidentBarComponent);
                frequencyIncidentBarComponent = <Frequency_IncidentBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyIncidentBarComponent.componentData = this.frequencyInput;
                frequencyIncidentBarComponent.printSettings = this.printSettings;
                frequencyIncidentBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyIncidentBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-incident-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_IncidentPieComponent);
                frequencyIncidentPieComponent = <Frequency_IncidentPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyIncidentPieComponent.componentData = this.frequencyInput;
                frequencyIncidentPieComponent.printSettings = this.printSettings;
                frequencyIncidentPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyIncidentPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-loss-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_LossBarComponent);
                frequencyLossBarComponent = <Frequency_LossBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyLossBarComponent.componentData = this.frequencyInput;
                frequencyLossBarComponent.printSettings = this.printSettings;
                frequencyLossBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyLossBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-loss-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_LossPieComponent);
                frequencyLossPieComponent = <Frequency_LossPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyLossPieComponent.componentData = this.frequencyInput;
                frequencyLossPieComponent.printSettings = this.printSettings;
                frequencyLossPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyLossPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;

            case 'severity-industry-overview':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_IndustryOverviewComponent);
                severityIndustryOverviewComponent = <Severity_IndustryOverviewComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityIndustryOverviewComponent.componentData = this.severityInput;
                severityIndustryOverviewComponent.printSettings = this.printSettings;
                severityIndustryOverviewComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityIndustryOverviewComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'severity-time-period':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_TimePeriodComponent);
                severityTimePeriodComponent = <Severity_TimePeriodComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityTimePeriodComponent.componentData = this.severityInput;
                severityTimePeriodComponent.printSettings = this.printSettings;
                severityTimePeriodComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityTimePeriodComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'severity-incident-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_IncidentBarComponent);
                severityIncidentBarComponent = <Severity_IncidentBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityIncidentBarComponent.componentData = this.frequencyInput;
                severityIncidentBarComponent.printSettings = this.printSettings;
                severityIncidentBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityIncidentBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'severity-incident-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_IncidentPieComponent);
                severityIncidentPieComponent = <Severity_IncidentPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityIncidentPieComponent.componentData = this.frequencyInput;
                severityIncidentPieComponent.printSettings = this.printSettings;
                severityIncidentPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityIncidentPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'severity-loss-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_LossBarComponent);
                severityLossBarComponent = <Severity_LossBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityLossBarComponent.componentData = this.frequencyInput;
                severityLossBarComponent.printSettings = this.printSettings;
                severityLossBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityLossBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'severity-loss-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_LossPieComponent);
                severityLossPieComponent = <Severity_LossPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityLossPieComponent.componentData = this.frequencyInput;
                severityLossPieComponent.printSettings = this.printSettings;
                severityLossPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityLossPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;

            case 'app-limit':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_LimtComponent);
                benchmarkLimitComponent = <Benchmark_LimtComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkLimitComponent.componentData = this.benchmarkDistributionInput;
                benchmarkLimitComponent.printSettings = this.printSettings;
                benchmarkLimitComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkLimitComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'app-peer-group-loss':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_PeerGroupLossComponent);
                benchmarkPeerGroupLossComponent = <Benchmark_PeerGroupLossComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkPeerGroupLossComponent.componentData = this.benchmarkLimitAdequacyInput;
                benchmarkPeerGroupLossComponent.printSettings = this.printSettings;
                benchmarkPeerGroupLossComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkPeerGroupLossComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'app-premium':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_PremiumComponent);
                benchmarkPremiumComponent = <Benchmark_PremiumComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkPremiumComponent.componentData = this.benchmarkDistributionInput;
                benchmarkPremiumComponent.printSettings = this.printSettings;
                benchmarkPremiumComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkPremiumComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'app-rate':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_RateComponent);
                benchmarkRateComponent = <Benchmark_RateComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkRateComponent.componentData = this.benchmarkRateInput;
                benchmarkRateComponent.printSettings = this.printSettings;
                benchmarkRateComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkRateComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'app-retention':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_RetentionComponent);
                benchmarkRetentionComponent = <Benchmark_RetentionComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkRetentionComponent.componentData = this.benchmarkDistributionInput;
                benchmarkRetentionComponent.printSettings = this.printSettings;
                benchmarkRetentionComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkRetentionComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;

            default:
                break;
        }
    }

    /**
     * Call back function that is triggered when the chart object is available for use.
     * Save the reference to the HighChart chart object
     * 
     * @private
     * @function setWorkingChart
     * @param {BaseChart} start - reference to the chart object that has the common superclass BaseChart
     * @return {} - No return types.
     */
    private setWorkingChart(chart: BaseChart) {
        this.chart = chart;
    }

    /**
     * Call back function that is triggered when the chart component if first rendered.
     * It will trigger image conversion one second later to allow the browser to finished
     * rendering chart's svg image.  Once done, call loadChartImage to perform conversion
     * 
     * @private
     * @function startImageConversion
     * @param {boolean} start - Indicate if the underlying chart component is rendered for the first time
     * @return {} - No return types.
     */
    private startImageConversion(start: boolean) {
        if(start && this.chart != null) {
            setTimeout(this.loadCurrentChartImage.bind(this), 1000);
        }
    }

    /**
     * This function is called after the rendering of the chart component.
     * If there is a svg chart loaded then start the svg to png conversion.
     * Otherwise, start loading the next chart image.
     * If no more charts, start the page counting process
     * 
     * @private
     * @function loadCurrentChartImage
     * @return {} - No return types.
     */
    private loadCurrentChartImage() {
        //check if svg image is loaded.  If it is loaded then use the canvasFactory to 
        //convert svg to png as a data URL
        let childImages = this.rootElement.nativeElement.getElementsByTagName('svg');
        if(childImages.length > 0) {
            //First child is th SVG image, calling chart.getSVG changes the underlying svg
            let svgElement = childImages[0];
            //IE doesn't support outerHTML for svg tag
            let data = svgElement.parentNode.innerHTML;
            //Filter out all child nodes except for the svg tag
            let indexPosition = data.indexOf('</svg>');
            if(indexPosition < 0) {
                indexPosition = data.indexOf('</SVG>');
            }
            if(indexPosition > 0) {
                //console.log("fragment = " + data.substr(indexPosition, 6));
                data = data.substr(0, indexPosition + 6);
            }
            //don't add attribute to svgElement via setAttribute, in IE it mangles the namespace
            //Firefox requires a specific xlink for external images
            data = data.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ');

            canvasFactory(this.canvas.nativeElement, data,  
                { 
                    ignoreMouse: true, 
                    ignoreAnimation: true, 
                    useCORS: true,
                    renderCallback: this.renderCompleteCallback.bind(this)
                }
            );
        } else {
            //if svg is not loaded, loaded the next chart
            if(this.chartLoadCount < this.chartDataCollection.length) {
                this.loadChartImage();
            } else {
                //Start off the page count process if no more chart images to load
                this.processPageCounts();
            }
        }
    }

    /**
     * Call back functon that is called when the canvas object is 
     * finished generating the png file as data url from svg object.
     * Add data url to page object.  If the page determines more 
     * pages are needed then update table of contents page object's 
     * page number.  Continues to process the next chart image by 
     * calling loadChartImage.  After all the pages' images are done, 
     * start the process page counts on pages that can only be 
     * counted by doing a test pdf rendering and counting the pages 
     * rendered by calling processPageCounts.
     * 
     * @private
     * @function renderCompleteCallback
     * @return {} - No return types.
     */
    private renderCompleteCallback() {
        let buffer = this.canvas.nativeElement.toDataURL('image/png');
        this.canvas.nativeElement.getContext('2d').clearRect(0, 0, this.printSettings.width, this.printSettings.height);
        this.entryPoint.clear();
        this.chartDataCollection[this.chartLoadCount].imageData = buffer;
        let pageOffset = this.chartDataCollection[this.chartLoadCount].targetPage.addChartLabel(this.chartDataCollection[this.chartLoadCount].pagePosition, this.chartDataCollection[this.chartLoadCount].imageIndex, this.chartDataCollection[this.chartLoadCount].imageData);
        //if the image added is placed beyond the first page we need to update toc
        if(pageOffset > 1) {
            //console.log(this.chartDataCollection[this.chartLoadCount].tocDescription + ' with page type ' + this.chartDataCollection[this.chartLoadCount].targetPage.getPageType() + ' is on page ' + pageOffset);
            this.tocPage.registerTOCPageOffset(this.chartDataCollection[this.chartLoadCount].tocDescription, this.chartDataCollection[this.chartLoadCount].targetPage.getPageType(), pageOffset);
        }
        this.chartLoadCount++;
        console.log('image size = ' + buffer.length);
        if(this.chartLoadCount < this.chartDataCollection.length) {
            this.loadChartImage();
        } else {
            this.processPageCounts();
        }
    }

    /**
     * It start to serially perform page count on the next 
     * page object in pageCollection in the order defined in pageOrder
     * Once all pages counts are determined, generate PDF
     * 
     * @private
     * @function processPageCounts
     * @return {} - No return types.
     */
    private processPageCounts() {
        if(this.pagesProcessedCount < this.pageOrder.length) {
            let pageType: string = this.pageOrder[this.pagesProcessedCount];
            let page: BasePage = this.pageCollection[pageType];
            if(page) {
                this.calculatePageCount(page);
            } else {
                this.pagesProcessedCount++;
                this.processPageCounts();                    
            }
        } else {
            this.generatePDF();
        }
    }

    /**
     * If a page has variable number of page from the function 
     * call isPageCountingRequired.  Calculate the number of pages 
     * the content of the page type takes within the pdf file.  It 
     * converts page object content to pdf and discard the result.
     * The page count comes from the footer callback code in 
     * PDFMakeBuilder class.  Then the page count is saved via the 
     * method setPageCount.  Then it continues to serially perform 
     * page count on the next page object in pageCollection in the 
     * order defined in pageOrder
     * 
     * @private
     * @function calculatePageCount
     * @param {string} pageType - name of the page type
     * @return {} - No return types.
     */
    private calculatePageCount(page: BasePage) {
        if(page.isPageCountingRequired()) {
            console.log('Counting pages for ' + page.getPageType());
            this.pdfBuilder.clearImages();
            this.pdfBuilder.clearStyles();
            this.pdfBuilder.clearPdfContent();
            this.pdfBuilder.setDifferentFirstPage(true);
            this.pdfBuilder.addPage(page);
            const pdfDocGenerator = this.pdfMake.createPdf(this.pdfBuilder.getContent());
            pdfDocGenerator.getBuffer((data) => {
                this.pagesProcessedCount++;
                //subtract one from the page count due to page break
                page.setPageCount(this.pdfBuilder.getPageCount() - 1 );
                console.log(page.getPageType() + ' has ' + page.getPageCount() + ' page(s).');
                this.processPageCounts();
            });
        } else {
            console.log('No need to count pages for ' + page.getPageType());
            this.pagesProcessedCount++;
            this.processPageCounts();
        }
    }

    /**
     * Generate the pdf file based on the pages 
     * with the chart images and tables loaded within
     * 
     * @private
     * @function generatePDF
     * @return {} - No return types.
     */
    private generatePDF() {
        //first page is the cover sheet, second to third page is the table of contents
        let pageNumber = 2 + this.tocPage.getPageCount();
        this.pageOrder.forEach(pageType => 
            {
                this.tocPage.setPageNumber(pageType, pageNumber);
                pageNumber = pageNumber + this.pageCollection[pageType].getPageCount();
            }
        );
        this.pdfBuilder.clearImages();
        this.pdfBuilder.clearStyles();
        this.pdfBuilder.clearPdfContent();
        this.pdfBuilder.setDifferentFirstPage(true);
        this.pdfBuilder.addPage(this.coverPage);
        this.pdfBuilder.addPage(this.tocPage);
        this.pageOrder.forEach(pageType => 
            {
                this.pdfBuilder.addPage(this.pageCollection[pageType]);
            }
        );

        //console.log(pg.getContent());
        this.pdfBuilder.trimLastPageBreak();
        this.pdfMake.createPdf(this.pdfBuilder.getContent()).download(this.pdfFilename);
        //console.log(pg.getContent());
    }

    /**
     * Determine if a page type is already added to the 
     * current collection of page objects.  Function returms
     * true if the page type is already added, otherwise false
     * 
     * @private
     * @function hasPageType
     * @param {string} pageType - name of the page type
     * @return {boolean} - true if the page type is already added, otherwise false
     */
    private hasPageType(pageType: string):boolean {
        return (this.pageCollection[pageType] ? true : false);
    }

    /**
     * Adds a page object based on the pageType
     * All page object have a common base class BasePage
     * 
     * @private
     * @function addPageType
     * @param {string} pageType - name of the page type
     * @return {} - No return types.
     */
    private addPageType(pageType: string) {
        switch(pageType) {
            case DashboardPage.pageType:
                this.pageCollection[pageType] = new DashboardPage();
                this.pageOrder.push(pageType);
                break;

            case FrequencyIndustryOverviewPage.pageType:
                this.pageCollection[pageType] = new FrequencyIndustryOverviewPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyTimePeriodPage.pageType:
                let frequencyTimePeriodPage = new FrequencyTimePeriodPage();
                frequencyTimePeriodPage.setDetailChartPermission(this.getChartDetailAccess(APPCONSTANTS.REPORTS_ID.frequencyTimePeriodDetails));
                this.pageCollection[pageType] = frequencyTimePeriodPage;
                this.pageOrder.push(pageType);
                break;
            case FrequencyTypeOfIncidentPage.pageType:
                this.pageCollection[pageType] = new FrequencyTypeOfIncidentPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyDataPrivacyPage.pageType:
                this.pageCollection[pageType] = new FrequencyDataPrivacyPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyNetworkSecurityPage.pageType:
                this.pageCollection[pageType] = new FrequencyNetworkSecurityPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyTechEOPage.pageType:
                this.pageCollection[pageType] = new FrequencyTechEOPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyPrivacyViolationsPage.pageType:
                this.pageCollection[pageType] = new FrequencyPrivacyViolationsPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyTypeOfLossPage.pageType:
                this.pageCollection[pageType] = new FrequencyTypeOfLossPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyPersonalInformationPage.pageType:
                this.pageCollection[pageType] = new FrequencyPersonalInformationPage();
                this.pageOrder.push(pageType);
                break;
            case FrequencyCorporateLossesPage.pageType:
                this.pageCollection[pageType] = new FrequencyCorporateLossesPage();
                this.pageOrder.push(pageType);
                break;

            case SeverityIndustryOverviewPage.pageType:
                this.pageCollection[pageType] = new SeverityIndustryOverviewPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityTimePeriodPage.pageType:
                let severityTimePeriodPage = new SeverityTimePeriodPage();
                severityTimePeriodPage.setDetailChartPermission(this.getChartDetailAccess(APPCONSTANTS.REPORTS_ID.severityTimePeriodDetails));
                this.pageCollection[pageType] = severityTimePeriodPage;
                this.pageOrder.push(pageType);
                break;
            case SeverityTypeOfIncidentPage.pageType:
                this.pageCollection[pageType] = new SeverityTypeOfIncidentPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityDataPrivacyPage.pageType:
                this.pageCollection[pageType] = new SeverityDataPrivacyPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityNetworkSecurityPage.pageType:
                this.pageCollection[pageType] = new SeverityNetworkSecurityPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityTechEOPage.pageType:
                this.pageCollection[pageType] = new SeverityTechEOPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityPrivacyViolationsPage.pageType:
                this.pageCollection[pageType] = new SeverityPrivacyViolationsPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityTypeOfLossPage.pageType:
                this.pageCollection[pageType] = new SeverityTypeOfLossPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityPersonalInformationPage.pageType:
                this.pageCollection[pageType] = new SeverityPersonalInformationPage();
                this.pageOrder.push(pageType);
                break;
            case SeverityCorporateLossesPage.pageType:
                this.pageCollection[pageType] = new SeverityCorporateLossesPage();
                this.pageOrder.push(pageType);
                break;

            case BenchmarkPage.pageType:
                this.pageCollection[pageType] = new BenchmarkPage();
                this.pageOrder.push(pageType);
                break;

            case FrequencyMostRecentPeerGroupLossesPage.pageType:
                let frequencyMostRecentPeerGroupLossesPage = new FrequencyMostRecentPeerGroupLossesPage();
                frequencyMostRecentPeerGroupLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.frequencyPeerLossesDetails));
                frequencyMostRecentPeerGroupLossesPage.setPeerGroupData(this.frequencyPeerGroupTable);
                this.pageCollection[pageType] = frequencyMostRecentPeerGroupLossesPage
                this.pageOrder.push(pageType);
                break;
            case FrequencyMostRecentCompanyLossesPage.pageType:
                let frequencyMostRecentCompanyLossesPage = new FrequencyMostRecentCompanyLossesPage();
                frequencyMostRecentCompanyLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.frequencyCompanyLossesDetails));
                frequencyMostRecentCompanyLossesPage.setPeerGroupData(this.frequencyCompanyLossesTable);
                this.pageCollection[pageType] = frequencyMostRecentCompanyLossesPage
                this.pageOrder.push(pageType);
                break;

            case SeverityTopPeerGroupLossesPage.pageType:
                let severityTopPeerGroupLossesPage = new SeverityTopPeerGroupLossesPage();
                severityTopPeerGroupLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.severityPeerLossesDetails));
                severityTopPeerGroupLossesPage.setPeerGroupData(this.severityPeerGroupTable);
                this.pageCollection[pageType] = severityTopPeerGroupLossesPage
                this.pageOrder.push(pageType);
                break;
            case SeverityTopCompanyLossesPage.pageType:
                let severityTopCompanyLossesPage = new SeverityTopCompanyLossesPage();
                severityTopCompanyLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.severityCompanyLossesDetails));
                severityTopCompanyLossesPage.setPeerGroupData(this.severityCompanyLossesTable);
                this.pageCollection[pageType] = severityTopCompanyLossesPage
                this.pageOrder.push(pageType);
                break;

                case GlossaryPage.pageType:
                let glossaryPage = new GlossaryPage();
                glossaryPage.setGlossaryData(this.reportGlossaryModel);
                this.pageCollection[pageType] = glossaryPage
                this.pageOrder.push(pageType);
                break;
                
            default:
                break;
        }
    }
    
}
