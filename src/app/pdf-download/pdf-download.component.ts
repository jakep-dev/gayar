import { Component, OnInit, AfterViewInit,  ViewChild, ViewContainerRef, ViewEncapsulation, ElementRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { DatePipe } from '@angular/common';

import { APPCONSTANTS } from 'app/app.const';

import { BaseChart } from 'app/shared/charts/base-chart';
import { BenchmarkComponent as Dashboard_BenchmarkComponent } from 'app/dashboard/benchmark/benchmark.component';
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

import { BusyOverlayRef, BusyOverlayComponent } from 'app/shared/components/components';
import { PdfCompleteComponent } from './pdf-complete.component';
import { PdfStartComponent } from './pdf-start.component';
import { DialogService } from 'app/shared/blocks/blocks';

import { 
    MenuService, SearchService, 
    FrequencyService, SeverityService, ApplicationService, SessionService,
    ReportService, FontService, GetFileService, OverlayService
} from 'app/services/services';
import { SnackBarService } from 'app/shared/shared';

import { 
    DashboardScore, 
    FrequencyInput, FrequencyDataModel, FrequencyDataResponseModel,
    SeverityInput, SeverityDataModel, SeverityDataResponseModel,
    BenchmarkDistributionInput, BenchmarkLimitAdequacyInput, BenchmarkRateInput, ComponentPrintSettings,
    IReportTileModel, IChartMetaData, IChartWidget, GlossaryDataModel, GlossaryTerm
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
import * as FileSaver from 'file-saver';
import { canvasFactory } from 'app/shared/pdf/pdfExport';
import { getPdfMake } from 'app/shared/pdf/pdfExport';
import { clearTimeout, setTimeout } from 'timers';

@Component({
    selector: 'pdf-download',
    templateUrl: 'pdf-download.component.html',
    styleUrls: ['./pdf-download.component.scss'],
    encapsulation: ViewEncapsulation.None,
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
export class PdfDownloadComponent implements OnInit, AfterViewInit {

    //Object used to generate PDF
    private pdfMake: any;

    //Object used to assemble the final json object for pdfmake library
    private pdfBuilder: PDFMakeBuilder;

    private coverPage: CoverPage;

    private tocPage: TOCPage;

    //input to dashboard charts
    private getDashboardScoreByManualInput: DashboardScore;

    //input to frequency charts
    private frequencyInput: FrequencyInput;

    //input to severity charts
    private severityInput: SeverityInput;

    //input for limit, premium and retention benchmark charts
    private benchmarkDistributionInput: BenchmarkDistributionInput;
    
    //input for peer group loss benchmark chart
    private benchmarkLimitAdequacyInput: BenchmarkLimitAdequacyInput;

    //input for rate benchmark chart
    private benchmarkRateInput: BenchmarkRateInput;

    //list of high level report sections
    public reportSelections: Array<IReportTileModel> = null;

    //list of report glossary terms
    public reportGlossaryModel: Array<GlossaryTerm> = null;

    //boolean to indicate report glossary data is loaded
    private reportGlossaryDataDone: boolean = false;

    //input to frequency most recent peer group losses table
    private frequencyPeerGroupTable: Array<FrequencyDataModel> = null;
    
    //input to frequency most recent company losses table
    private frequencyCompanyLossesTable: Array<FrequencyDataModel> = null;

    //boolean to indicate frequency data is loaded
    //private frequencyDataDone: boolean = false;

    //input to severity top peer group losses table
    private severityPeerGroupTable: Array<SeverityDataModel> = null;

    //input to severity top company losses table
    private severityCompanyLossesTable: Array<SeverityDataModel> = null;

    //boolean to indicate severity data is loaded
    //private severityDataDone: boolean = false;

    //indicate the number of chart objects processed
    private chartLoadCount: number;

    //indicate the number of pages processed
    private pagesProcessedCount: number;

    //list of chart data objects
    private chartDataCollection: Array<IChartMetaData> = [];

    //The current chart component being rendered
    private currentChartComponent: any = null;

    //list of  page type names
    private pageOrder: Array<string> = [];

    //associate array that maps page type to page object
    private pageCollection: Array<BasePage> = [];

    //print settings for the current chart being processed
    private printSettings: ComponentPrintSettings;

    private busyOverlayRef:BusyOverlayRef = null;
    
    //The html canvas object used to convert svg to png data url
    @ViewChild('canvas') canvas: ElementRef;

    //The insertion point for the dynamic loading of chart components
    @ViewChild('entryPoint', { read: ViewContainerRef }) entryPoint: ViewContainerRef;

    public isProcessing: boolean = false;
    
    private pdfDocument: any = null;
    
    private filename: string;

    private fileData: any = null;

    private static generateButtonId: number = 1;
    private static cancelButtonId: number = 2;

    private static INITIAL_MESSAGE = 'No Assessment Report!';

    public percentageText: string = '';

    private generateMenu: any = {
        id: PdfDownloadComponent.generateButtonId,
        menuName: PdfDownloadComponent.INITIAL_MESSAGE,
        iconName: 'party_mode'
    };

    public menuItems: Array<any> = [
        this.generateMenu
    ];

    //Reference to the HighChart object
    private chart: BaseChart;

    //maximum amount of time in milliseconds that a part of a long running process should take
    //this is used to wait for chart image to finish or to wait for all chart data to be complete
    //if this amount of time has past, trigger cancellation of pdf processing
    //set timeout for approximately 100 seconds
    private static MAX_TIMEOUT: number = 100 * 1000;
    private startTime: Date = null;
    private timeElapse: number = 0;
    private currentWaitPeriod: number = 0;
    private timeoutMessage: string = '';

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
            //console.log('Font files loaded!');
        }
    }

    constructor(
        private searchService: SearchService,
        private sessionService: SessionService,
        private snackBarService: SnackBarService,
        private fontService: FontService,
        private getFileService: GetFileService,
        private rootElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private frequencyService: FrequencyService,
        private severityService: SeverityService,
        private reportService: ReportService,
        private applicationService: ApplicationService,
        private overlayDialog: OverlayService,
        private dialogService: DialogService
    ) {
        //If font files are not loaded setup the call back function to catch the event when font files are loaded
        if(this.fontService.isLoadComplete()) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
            //console.log('Font files already loaded!');
        } else {
            this.fontService.loadCompleted$.subscribe(this.configurePDFMake.bind(this));
        }

        this.pdfBuilder = new PDFMakeBuilder();

        //Create cover page
        this.coverPage = new CoverPage();

        //Create table of contents page
        this.tocPage = new TOCPage();
    }

    /**
     * get the pdf filename for the current report being constructed
     * 
     * @public
     * @function getPdfFilename
     * @return {string} - filename of the pdf output
     */
    private getPdfFilename(): string {
        const dp = new DatePipe('en-US');
        return 'Cyber OverVue Report_' + this.coverPage.getCompanyName() + '_' + dp.transform(new Date(), 'MMddyyyy') + '.pdf';
    }

    /**
     * Setup chart component input objects used to instantiate chart components
     * 
     * @private
     * @function setupChartInput
     * @param {string} naics - naics code for the company selected in the search
     * @param {string} revenueRange - revenue range for the company selected in the search
     * @return {} - No return types.
     */
    private setupChartInput(naics: string, revenueRange: string) {
        let searchType: string = this.searchService.searchCriteria.type;
        
        let companyId: number;
        if (searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            companyId = this.searchService.selectedCompany.companyId;
        } else {
            companyId = null;
        }

        let limit: string = this.searchService.getLimit;
        let retention: string = this.searchService.getRetention;
        let premium: string = this.searchService.getPremium;
        let revenueRangeId: string = this.searchService.getRevenueRangeId;

        this.getDashboardScoreByManualInput = {
            searchType: searchType,
            chartType: 'BENCHMARK',
            companyId: companyId,
            naics: naics,
            revenueRange: revenueRange,
            limit : limit,
            retention: retention,
        };

        this.frequencyInput = {
            searchType: searchType,
            companyId: companyId,
            naics: naics,
            revenueRange: revenueRange
        };

        this.severityInput = {
            searchType: searchType,
            companyId: companyId,
            naics: naics,
            revenueRange: revenueRange
        };

        this.benchmarkDistributionInput = {
            searchType: searchType,
            companyId: companyId,
            premiumValue: premium,
            limitValue: limit,
            retentionValue: retention,
            naics: naics,
            revenueRange: revenueRange
        }

        this.benchmarkLimitAdequacyInput = {
            searchType: searchType,
            companyId: companyId,
            limits: limit,
            naics: naics,
            revenueRange: revenueRangeId
        };

        this.benchmarkRateInput = {
            searchType: searchType,
            companyId: companyId,
            premiumValue: premium,
            limitValue: limit,
            naics: naics,
            revenueRange: revenueRangeId
        };
    }

    /**
     * getReportGlossaryConfig - Load the report glossary configuration.
     *
     * @private
     * @function getReportGlossaryConfig
     * @return {} - No return types.
     */
    private getReportGlossaryConfig () {
        this.applicationService.getGlossary()
        .subscribe((res: GlossaryDataModel) => {
          this.reportGlossaryModel = res.glossaries;
          //console.log('Report Glossary Data Done!');
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
    // private getFrequencyTables() {
    //     this.frequencyService.getFrequencyDataTable(this.searchService.getCompanyId,
    //         this.searchService.getNaics,
    //         this.searchService.getRevenueRange)
    //         .subscribe((res: FrequencyDataResponseModel) => {
    //             this.frequencyPeerGroupTable = res.peerGroup;
    //             if (res.company != null && res.company.length > 0) {
    //                 this.frequencyCompanyLossesTable = res.company;
    //             }
    //             //console.log('Frequency Data Done!');
    //             this.frequencyDataDone = true;
    //     });        
    // }

    /**
     * Get severity table data for 
     * Top Peer Group Losses and Top Company Losses sections
     * 
     * @private
     * @function getSeverityTables
     * @return {} - No return types.
     */
    // private getSeverityTables() {
    //     this.severityService.getSeverityDataTable(this.searchService.getCompanyId, this.searchService.getNaics, this.searchService.getRevenueRange).subscribe((res: SeverityDataResponseModel) => {
    //         this.severityPeerGroupTable = res.peerGroup;
    //         if (res.company != null && res.company.length > 0) {
    //             this.severityCompanyLossesTable = res.company;
    //         }
    //         //console.log('Severity Data Done!');
    //         this.severityDataDone = true;
    //     });
    // }

    /**
     * Reset menu settings and pdf file related data
     * Calls resetDataStructures() to clear out data structures
     * 
     * @private
     * @function resetDownloadMenu
     * @return {} - No return types.
     */
    private resetDownloadMenu() {
        this.fileData = null;
        this.filename = null;
        this.pdfDocument = null;
        this.generateMenu.menuName = PdfDownloadComponent.INITIAL_MESSAGE;
        this.resetDataStructures();
        this.resetTimer();
        this.resetTimeoutObjects();
        this.percentageText = '';
    }

    /**
     * Clear out data structures like images page objects
     * 
     * @private
     * @function resetDataStructures
     * @return {} - No return types.
     */
    private resetDataStructures() {
        //this.frequencyPeerGroupTable = null;
        //this.frequencyCompanyLossesTable = null;
        //this.frequencyDataDone = false;
        //this.severityPeerGroupTable = null;
        //this.severityCompanyLossesTable = null;
        //this.severityDataDone = false;
        this.chartLoadCount = 0;
        this.pagesProcessedCount = 0;
        this.chartDataCollection.length = 0;
        this.pageOrder.length = 0;
        this.clearArray(this.pageCollection);
        this.tocPage.clearTOC();
        this.entryPoint.clear();
    }

    /**
     * Clears all set timeout objects used in the assessment report process
     * 
     * @private
     * @function resetTimeoutObjects
     * @return {} - No return types.
     */
    private resetTimeoutObjects() {
        if(this.backgroundProcessTimeout == null) {
            clearTimeout(this.backgroundProcessTimeout);
        }
        if(this.startReportTimeout == null) {
            clearTimeout(this.startReportTimeout);
        }
        if(this.startImageTimeout == null) {
            clearTimeout(this.startImageTimeout);
        }
        if(this.pdfGenerateTimeout == null) {
            clearTimeout(this.pdfGenerateTimeout);
        }
        if(this.startupTimeout == null) {
            clearTimeout(this.startupTimeout);
        }
    }

    /**
     * Clear out timer counts
     * 
     * @private
     * @function resetTimer
     * @return {} - No return types.
     */
    private resetTimer() {
        //console.log(this.getDateTimeString() + '[resetTimer] timeElapsed = ' + this.timeElapse);
        this.timeElapse = 0;
        this.currentWaitPeriod = 0;
    }

    private backgroundProcessTimeout: any = null;

    /**
     * Set the polling interval to check if a long running process is done
     * call this function with value = 0 means will notify to backgroundTimeChecker that process is finish
     * 
     * @private
     * @function setPollingInterval
     * @param {number} value - number of milliseconds for the polling period
     * @return {} - No return types.
     */
    private setPollingInterval(value: number) {
        //console.log(this.getDateTimeString() + '[setPollingInterval] timeElapsed = ' + this.timeElapse);
        this.currentWaitPeriod = value;
    }

    /**
     * Set the starting time for the timer used
     * 
     * @private
     * @function startTimer
     * @return {} - No return types.
     */
    private startTimer() {
        this.startTime = new Date();
    }

    /**
     * Start the background timer
     * Trigger timeout and cancel the current pdf generation when timeout is hit
     * 
     * @private
     * @function startBackgroundTimer
     * @param {number} pollingInterval - number of milliseconds for the polling period
     * @return {} - No return types.
     */
    private startBackgroundTimer(pollingInterval: number) {
        this.startTimer();
        this.currentWaitPeriod = pollingInterval;
        //console.log(this.getDateTimeString() + '[startBackgroundTimer] currentWaitPeriod = ' + this.currentWaitPeriod);
        this.backgroundProcessTimeout = setTimeout(() => this.backgroundTimeChecker(), this.currentWaitPeriod);
    }

    /**
     * When the polling interval is hit update timers
     * 
     * @private
     * @function updateElapsedTime
     * @return {} - No return types.
     */    
    private updateElapsedTime() {
        let currentTime: Date = new Date();
        //console.log(this.getDateTimeString(currentTime) + '[' + currentTime.getTime()  + ']' + this.getDateTimeString(this.startTime) + '[' + this.startTime.getTime() + ']');
        var timeDifference: number = (currentTime.getTime() - this.startTime.getTime());
        this.timeElapse = timeDifference;
    }

    /**
     * Background timer trigger timeout and cancel the current pdf generation when timeout is hit
     * 
     * @private
     * @function backgroundTimeChecker
     * @return {} - No return types.
     */
    private backgroundTimeChecker() {
        clearTimeout(this.backgroundProcessTimeout);
        this.backgroundProcessTimeout = null;
        if(this.currentWaitPeriod > 0) {
            this.updateElapsedTime();
            //console.log(this.getDateTimeString() + '[backgroundTimeChecker] timeElapsed = ' + this.timeElapse);
            if(this.timeElapse >= PdfDownloadComponent.MAX_TIMEOUT) {
                this.isProcessing = false;
                this.percentageText = '';
                this.resetDownloadMenu();
                this.snackBarService.Simple(this.timeoutMessage);
            } else {
                if(this.isProcessing) {
                    this.backgroundProcessTimeout = setTimeout(() => this.backgroundTimeChecker(), this.currentWaitPeriod);
                }
            }    
        }
    }

    private getDateTimeString(inputDate?: Date): string {
        let currentDateTime = inputDate || (new Date());
        let value: string = '[' + currentDateTime.getFullYear() + '-' + currentDateTime.getMonth() + '-' + currentDateTime.getDate() + ' ' + currentDateTime.getHours() + ':' + currentDateTime.getMinutes() + ':' + currentDateTime.getSeconds() + '.' + currentDateTime.getMilliseconds() + ']';
        return value;
    }
    
    /**
     * Set the text of the menu button and the download menu item
     * 
     * @private
     * @function setDownloadMenuMessage
     * @param {string} message - menu item text
     * @param {string} percentageText - the percentage text next to the menu button
     * @return {} - No return types.
     */
    private setDownloadMenuMessage(message: string, percentageText: string) {
        this.generateMenu.menuName = message;
        this.percentageText = percentageText;
    }

    /**
     * Ensure we have the the download and cancel menu items
     * 
     * @private
     * @function addMenu
     * @return {} - No return types.
     */
    private addMenu() {
        this.menuItems = [this.generateMenu];
    }

    /**
     * Callback that is called after menu button is clicked
     * Handles report download and cancel report
     * 
     * @private
     * @function menuClicked
     * @return {} - No return types.
     */
    public menuClicked(buttonId: number) {
        //console.log(buttonId);
        if(buttonId == PdfDownloadComponent.generateButtonId) {
            if(this.pdfDocument && this.fileData) {
                FileSaver.saveAs(this.fileData, this.filename || 'Assessment_Report.pdf');
                this.percentageText = '';
            } else if(this.isProcessing) {
                this.snackBarService.Simple('Please wait for the pdf process to complete.');
            }
        } else if(buttonId == PdfDownloadComponent.cancelButtonId) {
            //this.busyOverlayRef = this.overlayDialog.open({componentData: 'Please wait while we are finalizing the pdf data!'});
            this.isProcessing = false;
            this.fileData = null;
            this.generateMenu.menuName = PdfDownloadComponent.INITIAL_MESSAGE;
            this.percentageText = '';
        }
    }

    /**
     * Starts the pdf generation process based on search input, report selections and user's permissions
     * 
     * @private
     * @function buildPdf
     * @param {Array<IReportTileModel} reportSelections - input user selections and permission settings based on user's login
     * @return {} - No return types.
     */
    public buildPdf(reportSelections: Array<IReportTileModel>, frequencyPeerGroupTable: FrequencyDataModel[], frequencyCompanyLossesTable: FrequencyDataModel[], severityPeerGroupTable: SeverityDataModel[], severityCompanyLossesTable: SeverityDataModel[]) {

        if(!this.isProcessing) {
            this.isProcessing = true;
            this.frequencyPeerGroupTable = frequencyPeerGroupTable;
            this.frequencyCompanyLossesTable = frequencyCompanyLossesTable;
            this.severityPeerGroupTable = severityPeerGroupTable;
            this.severityCompanyLossesTable = severityCompanyLossesTable;
            this.resetDownloadMenu();
            this.addMenu();

            let componentFactory: ComponentFactory<PdfStartComponent> = this.componentFactoryResolver.resolveComponentFactory(PdfStartComponent);
            this.dialogService.SimpleComponent(componentFactory.componentType, { width: '300px' }, null);

            if(!this.reportGlossaryDataDone) {
                this.getReportGlossaryConfig();
            }
    
            this.reportSelections = reportSelections;
            let naics: string = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
            let revenueRange: string = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null; 
    
            //set cover page's company name, industry name and revenue range labels
            this.coverPage.setCompanyName((this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) ? this.searchService.selectedCompany.companyName : this.searchService.searchCriteria.value);
            if(naics) {
                this.coverPage.setIndustryName(naics);
            }
            if(revenueRange) {
                this.coverPage.setRevenueRangeText(revenueRange);
            }
            
            //initialize chart input objects
            this.setupChartInput(naics, revenueRange);
            //Call frequecy service to get frequency table data
            //this.getFrequencyTables();
            //Call severity service to get severity table data
            //this.getSeverityTables();
    
            //Start the pdf generation process
            this.resetTimer();
            this.onReport();
        } else {
            this.snackBarService.Simple('PDF Generation in progress.  Please cancel current process and try again.');
        }
    }

    private startReportTimeout: any = null;
    /**
     * Continuosly wait for all resources and data are loaded before starting the pdf generation process
     * 
     * @private
     * @function onReport
     * @return {} - No return types.
     */
    private onReport () {
        if(this.startReportTimeout) {
            clearTimeout(this.startReportTimeout);
            this.startReportTimeout = null;
        }
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
            //check if the pdf fonts are loaded
            //check if cover page image is loaded
            //check if report glossary data is loaded
            //check if frequency table data is loaded
            //check if severity table data is loaded
            if(this.pdfMake && this.coverPage.isCoverPageLoaded() && this.reportGlossaryDataDone 
//                && this.frequencyDataDone && this.severityDataDone
            ) {
                this.setDownloadMenuMessage('5% done.', '5%');
                this.resetTimer();
                this.startReportProcess();
            } else {
                if(this.currentWaitPeriod == 0) {
                    this.setPollingInterval(1000);
                    this.startTimer();
                } else {
                    this.updateElapsedTime();
                }
                if(this.timeElapse >= PdfDownloadComponent.MAX_TIMEOUT) {
                    this.resetDownloadMenu();

                    this.isProcessing = false;
                    this.percentageText = '';
                    
                    this.snackBarService.Simple('Unable to get required assessment report data');
                } else {
                    console.log('Waiting for resources to load before starting report.');
                    this.setDownloadMenuMessage('0% done.', '0%');
                    this.startReportTimeout = setTimeout(() => this.onReport(), this.currentWaitPeriod);
                }
            }
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
        this.reportSelections.forEach(reportSection => {
            if(reportSection.value) {
                this.processReportSection(reportSection);
            }
        });
        this.setDownloadMenuMessage('10% done.', '10%');
        //console.log(this.chartDataCollection);
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
            //Start processing of chart images
            if(this.chartDataCollection.length > 0) {
                this.resetTimer();
                this.loadChartImage();
            } else if(this.pageOrder.length > 0) {
                //if no chart images the start the page count processing
                this.processPageCounts();
            }
        }
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
            //console.log('Deleting key ' + item);
            delete array[item];
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
        let topHeaderEnabled: boolean = false;
        let subEntryAdded;

        section.subComponents.forEach(subComponentItem => {
            if(subComponentItem.value) {
                if(!sectionHeaderAdded) {
                    //console.log('Section = ' + section.description + ' pageType = ' + subComponentItem.pageType);
                    this.tocPage.addTocEntry(section.description, 1, subComponentItem.pageType);
                    sectionHeaderAdded = true;
                    topHeaderEnabled = true;
                }
                //console.log('Sub Component = ' + subComponentItem.description + ' pageType = ' + subComponentItem.pageType);
                this.tocPage.addTocEntry(subComponentItem.description, 2, subComponentItem.pageType);
                subEntryAdded = true;
                this.loadChartCollection(subComponentItem.chartComponents, subComponentItem.pageType, subComponentItem.description, topHeaderEnabled);
                topHeaderEnabled = false;
            } else {
                subEntryAdded = false;
            }
            if(subComponentItem.subSubComponents) {
                subComponentItem.subSubComponents.forEach(subSubComponentItem => {
                    if(subSubComponentItem.value) {
                        if(!sectionHeaderAdded) {
                            //console.log('Section = ' + section.description + ' pageType = ' + subComponentItem.pageType);
                            this.tocPage.addTocEntry(section.description, 1, subComponentItem.pageType);
                            sectionHeaderAdded = true;
                            topHeaderEnabled = true;
                        }
                        if(!subEntryAdded) {
                            //console.log('Sub Component = ' + subComponentItem.description + ' pageType = ' + subComponentItem.pageType);
                            this.tocPage.addTocEntry(subComponentItem.description, 2, subComponentItem.pageType);
                            this.loadChartCollection(subComponentItem.chartComponents, subComponentItem.pageType, subComponentItem.description, topHeaderEnabled);
                            topHeaderEnabled = false;
                            subEntryAdded = true;
                        }
                        //console.log('Sub Sub Component = ' + subSubComponentItem.description + ' pageType = ' + subSubComponentItem.pageType);
                        this.tocPage.addTocEntry(subSubComponentItem.description, 3, subSubComponentItem.pageType);
                        this.loadChartCollection(subSubComponentItem.chartComponents, subSubComponentItem.pageType, subSubComponentItem.description, topHeaderEnabled);
                        topHeaderEnabled = false;
                    }
                });
            }
            
        });
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
     * @param {boolean} showHeader - Tell to underlying page if the top level section header needs to be shown
     * @return {} - No return types.
     */
    private loadChartCollection(chartComponents:IChartWidget[], pageType: string, tocDescription: string, showHeader: boolean) {
        let n: number;
        let i: number;

        if(!this.hasPageType(pageType)) {
            this.addPageType(pageType, showHeader);
            //console.log('Loaded Page type ' + pageType);
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
     * @param {boolean} showHeader - Tell to underlying page if the top level section header needs to be shown
     * @return {} - No return types.
     */
    private addPageType(pageType: string, showHeader: boolean) {
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
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyTypeOfIncidentPage.pageType:
                this.pageCollection[pageType] = new FrequencyTypeOfIncidentPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyDataPrivacyPage.pageType:
                this.pageCollection[pageType] = new FrequencyDataPrivacyPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyNetworkSecurityPage.pageType:
                this.pageCollection[pageType] = new FrequencyNetworkSecurityPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyTechEOPage.pageType:
                this.pageCollection[pageType] = new FrequencyTechEOPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyPrivacyViolationsPage.pageType:
                this.pageCollection[pageType] = new FrequencyPrivacyViolationsPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyTypeOfLossPage.pageType:
                this.pageCollection[pageType] = new FrequencyTypeOfLossPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyPersonalInformationPage.pageType:
                this.pageCollection[pageType] = new FrequencyPersonalInformationPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyCorporateLossesPage.pageType:
                this.pageCollection[pageType] = new FrequencyCorporateLossesPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;

            case SeverityIndustryOverviewPage.pageType:
                this.pageCollection[pageType] = new SeverityIndustryOverviewPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityTimePeriodPage.pageType:
                let severityTimePeriodPage = new SeverityTimePeriodPage();
                severityTimePeriodPage.setDetailChartPermission(this.getChartDetailAccess(APPCONSTANTS.REPORTS_ID.severityTimePeriodDetails));
                this.pageCollection[pageType] = severityTimePeriodPage;
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityTypeOfIncidentPage.pageType:
                this.pageCollection[pageType] = new SeverityTypeOfIncidentPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityDataPrivacyPage.pageType:
                this.pageCollection[pageType] = new SeverityDataPrivacyPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityNetworkSecurityPage.pageType:
                this.pageCollection[pageType] = new SeverityNetworkSecurityPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityTechEOPage.pageType:
                this.pageCollection[pageType] = new SeverityTechEOPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityPrivacyViolationsPage.pageType:
                this.pageCollection[pageType] = new SeverityPrivacyViolationsPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityTypeOfLossPage.pageType:
                this.pageCollection[pageType] = new SeverityTypeOfLossPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityPersonalInformationPage.pageType:
                this.pageCollection[pageType] = new SeverityPersonalInformationPage();
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityCorporateLossesPage.pageType:
                this.pageCollection[pageType] = new SeverityCorporateLossesPage();
                this.pageCollection[pageType].showHeader(showHeader);
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
                this.pageCollection[pageType] = frequencyMostRecentPeerGroupLossesPage;
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case FrequencyMostRecentCompanyLossesPage.pageType:
                let frequencyMostRecentCompanyLossesPage = new FrequencyMostRecentCompanyLossesPage();
                frequencyMostRecentCompanyLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.frequencyCompanyLossesDetails));
                frequencyMostRecentCompanyLossesPage.setPeerGroupData(this.frequencyCompanyLossesTable);
                this.pageCollection[pageType] = frequencyMostRecentCompanyLossesPage;
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;

            case SeverityTopPeerGroupLossesPage.pageType:
                let severityTopPeerGroupLossesPage = new SeverityTopPeerGroupLossesPage();
                severityTopPeerGroupLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.severityPeerLossesDetails));
                severityTopPeerGroupLossesPage.setPeerGroupData(this.severityPeerGroupTable);
                this.pageCollection[pageType] = severityTopPeerGroupLossesPage;
                this.pageCollection[pageType].showHeader(showHeader);
                this.pageOrder.push(pageType);
                break;
            case SeverityTopCompanyLossesPage.pageType:
                let severityTopCompanyLossesPage = new SeverityTopCompanyLossesPage();
                severityTopCompanyLossesPage.setDesciptionPermission(this.getTableDetailAccess(APPCONSTANTS.REPORTS_ID.severityCompanyLossesDetails));
                severityTopCompanyLossesPage.setPeerGroupData(this.severityCompanyLossesTable);
                this.pageCollection[pageType] = severityTopCompanyLossesPage;
                this.pageCollection[pageType].showHeader(showHeader);
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
     * Loads the next chart component from the chartDataCollection
     * Wire callback event to get underlying chart object reference
     * and trigger image conversion when svg image is rendered
     * 
     * @private
     * @function loadChartImage
     * @return {} - No return types.
     */
    private loadChartImage() {
        let componentFactory: ComponentFactory<any> = null;
        
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
                this.currentChartComponent = dashboardFrequencyGaugeComponent;
                break;
            case 'app-dashboard-severity':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Dashboard_SeverityComponent);
                dashboardSeverityGaugeComponent = <Dashboard_SeverityComponent>this.entryPoint.createComponent(componentFactory).instance;
                dashboardSeverityGaugeComponent.componentData = this.getDashboardScoreByManualInput;
                dashboardSeverityGaugeComponent.printSettings = this.printSettings;
                dashboardSeverityGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                dashboardSeverityGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = dashboardSeverityGaugeComponent;
                break;
            case 'dashboard-benchmark-score':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Dashboard_BenchmarkComponent);
                dashboardBenchmarkGaugeComponent = <Dashboard_BenchmarkComponent>this.entryPoint.createComponent(componentFactory).instance;
                dashboardBenchmarkGaugeComponent.componentData = this.getDashboardScoreByManualInput;
                dashboardBenchmarkGaugeComponent.printSettings = this.printSettings;
                dashboardBenchmarkGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                dashboardBenchmarkGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = dashboardBenchmarkGaugeComponent;
                break;

            case 'frequency-industry-overview':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_IndustryOverviewComponent);
                frequencyIndustryOverviewComponent = <Frequency_IndustryOverviewComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyIndustryOverviewComponent.componentData = this.frequencyInput;
                frequencyIndustryOverviewComponent.printSettings = this.printSettings;
                frequencyIndustryOverviewComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyIndustryOverviewComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = frequencyIndustryOverviewComponent;
                break;
            case 'frequency-time-period':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_TimePeriodComponent);
                frequencyTimePeriodComponent = <Frequency_TimePeriodComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyTimePeriodComponent.componentData = this.frequencyInput;
                frequencyTimePeriodComponent.printSettings = this.printSettings;
                frequencyTimePeriodComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyTimePeriodComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = frequencyTimePeriodComponent;
                break;
            case 'frequency-incident-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_IncidentBarComponent);
                frequencyIncidentBarComponent = <Frequency_IncidentBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyIncidentBarComponent.componentData = this.frequencyInput;
                frequencyIncidentBarComponent.printSettings = this.printSettings;
                frequencyIncidentBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyIncidentBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = frequencyIncidentBarComponent;
                break;
            case 'frequency-incident-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_IncidentPieComponent);
                frequencyIncidentPieComponent = <Frequency_IncidentPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyIncidentPieComponent.componentData = this.frequencyInput;
                frequencyIncidentPieComponent.printSettings = this.printSettings;
                frequencyIncidentPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyIncidentPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = frequencyIncidentPieComponent;
                break;
            case 'frequency-loss-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_LossBarComponent);
                frequencyLossBarComponent = <Frequency_LossBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyLossBarComponent.componentData = this.frequencyInput;
                frequencyLossBarComponent.printSettings = this.printSettings;
                frequencyLossBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyLossBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = frequencyLossBarComponent;
                break;
            case 'frequency-loss-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Frequency_LossPieComponent);
                frequencyLossPieComponent = <Frequency_LossPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                frequencyLossPieComponent.componentData = this.frequencyInput;
                frequencyLossPieComponent.printSettings = this.printSettings;
                frequencyLossPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                frequencyLossPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = frequencyLossPieComponent;
                break;

            case 'severity-industry-overview':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_IndustryOverviewComponent);
                severityIndustryOverviewComponent = <Severity_IndustryOverviewComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityIndustryOverviewComponent.componentData = this.severityInput;
                severityIndustryOverviewComponent.printSettings = this.printSettings;
                severityIndustryOverviewComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityIndustryOverviewComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = severityIndustryOverviewComponent;
                break;
            case 'severity-time-period':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_TimePeriodComponent);
                severityTimePeriodComponent = <Severity_TimePeriodComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityTimePeriodComponent.componentData = this.severityInput;
                severityTimePeriodComponent.printSettings = this.printSettings;
                severityTimePeriodComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityTimePeriodComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = severityTimePeriodComponent;
                break;
            case 'severity-incident-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_IncidentBarComponent);
                severityIncidentBarComponent = <Severity_IncidentBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityIncidentBarComponent.componentData = this.frequencyInput;
                severityIncidentBarComponent.printSettings = this.printSettings;
                severityIncidentBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityIncidentBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = severityIncidentBarComponent;
                break;
            case 'severity-incident-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_IncidentPieComponent);
                severityIncidentPieComponent = <Severity_IncidentPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityIncidentPieComponent.componentData = this.frequencyInput;
                severityIncidentPieComponent.printSettings = this.printSettings;
                severityIncidentPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityIncidentPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = severityIncidentPieComponent;
                break;
            case 'severity-loss-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_LossBarComponent);
                severityLossBarComponent = <Severity_LossBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityLossBarComponent.componentData = this.frequencyInput;
                severityLossBarComponent.printSettings = this.printSettings;
                severityLossBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityLossBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = severityLossBarComponent;
                break;
            case 'severity-loss-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Severity_LossPieComponent);
                severityLossPieComponent = <Severity_LossPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                severityLossPieComponent.componentData = this.frequencyInput;
                severityLossPieComponent.printSettings = this.printSettings;
                severityLossPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                severityLossPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = severityLossPieComponent;
                break;

            case 'app-limit':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_LimtComponent);
                benchmarkLimitComponent = <Benchmark_LimtComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkLimitComponent.componentData = this.benchmarkDistributionInput;
                benchmarkLimitComponent.printSettings = this.printSettings;
                benchmarkLimitComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkLimitComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = benchmarkLimitComponent;
                break;
            case 'app-peer-group-loss':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_PeerGroupLossComponent);
                benchmarkPeerGroupLossComponent = <Benchmark_PeerGroupLossComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkPeerGroupLossComponent.componentData = this.benchmarkLimitAdequacyInput;
                benchmarkPeerGroupLossComponent.printSettings = this.printSettings;
                benchmarkPeerGroupLossComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkPeerGroupLossComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = benchmarkPeerGroupLossComponent;
                break;
            case 'app-premium':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_PremiumComponent);
                benchmarkPremiumComponent = <Benchmark_PremiumComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkPremiumComponent.componentData = this.benchmarkDistributionInput;
                benchmarkPremiumComponent.printSettings = this.printSettings;
                benchmarkPremiumComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkPremiumComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = benchmarkPremiumComponent;
                break;
            case 'app-rate':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_RateComponent);
                benchmarkRateComponent = <Benchmark_RateComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkRateComponent.componentData = this.benchmarkRateInput;
                benchmarkRateComponent.printSettings = this.printSettings;
                benchmarkRateComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkRateComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = benchmarkRateComponent;
                break;
            case 'app-retention':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(Benchmark_RetentionComponent);
                benchmarkRetentionComponent = <Benchmark_RetentionComponent>this.entryPoint.createComponent(componentFactory).instance;
                benchmarkRetentionComponent.componentData = this.benchmarkDistributionInput;
                benchmarkRetentionComponent.printSettings = this.printSettings;
                benchmarkRetentionComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                benchmarkRetentionComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                this.currentChartComponent = benchmarkRetentionComponent;
                break;

            default:
                break;
        }
        if(componentFactory) {
            //console.log('Starting timer for ' + chartData.chartSetting.componentName);
            this.timeoutMessage = 'Unable to load chart ' + chartData.chartSetting.componentName;
            this.startBackgroundTimer(1000);
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

    private startImageTimeout: any = null;
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
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
            //console.log('Inside startImageConversion');
            if(start && this.chart != null) {
                this.startImageTimeout = setTimeout(() => this.loadCurrentChartImage(), 1000);
            }
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
        clearTimeout(this.startImageTimeout);
        this.startImageTimeout = null;
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
            //console.log('Inside loadCurrentChartImage');
            //check if svg image is loaded.  If it is loaded then use the canvasFactory to 
            //convert svg to png as a data URL
            let childImages = this.rootElement.nativeElement.getElementsByTagName('svg');
            if(childImages.length > 0) {
                //First child is th SVG image, calling chart.getSVG changes the underlying svg
                let svgElement = childImages[0];
                let tspanList: Array<any> = svgElement.getElementsByTagName('tspan');
                let isNoData = false;
                if(tspanList.length > 0) {
                    let i: number;
                    let n: number = tspanList.length;
                    let chartSize: ComponentPrintSettings = this.chartDataCollection[this.chartLoadCount].targetPage.getPrintSettings(0);
                    let x: number = (chartSize.width - 132.0) / 2.0;
                    let y: number = (chartSize.height - 12.0) / 2.0;
                    let translateValue = 'translate(' + x + ',' + y + ')';
                    //console.log('width = ' + chartSize.width + ' height = ' + chartSize.height);
                    //console.log('x = ' + x + ', y = ' + y);
                    for(i = 0; i < n; i++) {
                        if(tspanList[i].innerHTML === 'No Data Available') {
                            isNoData = true;
                            tspanList[i].parentElement.parentElement.attributes['transform'].value = translateValue;
                        } else if(tspanList[i].childNodes && (tspanList[i].childNodes.length == 1) && (tspanList[i].childNodes[0].textContent === 'No Data Available') ) {
                            isNoData = true;
                            tspanList[i].parentNode.parentNode.attributes["transform"].value = translateValue;
                        }
                    }
                }
                // if(isNoData) {
                //     this.setPollingInterval(0);
                //     this.chartLoadCount++;
                //     //if svg is showing a chart with no data, loaded the next chart
                //     if(this.chartLoadCount < this.chartDataCollection.length) {
                //         this.resetTimer();
                //         this.loadChartImage();
                //     } else {
                //         //Start off the page count process if no more chart images to load
                //         this.processPageCounts();
                //     }
                // } else {
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
                // }
            } else {
                this.setPollingInterval(0);
                //if svg is not loaded, loaded the next chart
                if(this.chartLoadCount < this.chartDataCollection.length) {
                    this.resetTimer();
                    this.loadChartImage();
                } else {
                    //Start off the page count process if no more chart images to load
                    this.processPageCounts();
                }
            }
        }
    }

    /**
     * Get the current chart component from the chartDataCollection
     * and get the display text if any
     * 
     * @private
     * @function getCurrentChartComponentText
     * @return {string} - The current chart component's display text
     */
    private getCurrentChartComponentText() : string {
        let displayText = null;

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

        //get the current chart in the chartDataCollection
        let chartData: IChartMetaData = this.chartDataCollection[this.chartLoadCount];
        switch(chartData.chartSetting.componentName) {

            case 'app-dashboard-frequency':
                dashboardFrequencyGaugeComponent = <Dashboard_FrequencyComponent>this.currentChartComponent;
                displayText = dashboardFrequencyGaugeComponent.getDisplayText();
                break;
            case 'app-dashboard-severity':
                dashboardSeverityGaugeComponent = <Dashboard_SeverityComponent>this.currentChartComponent;
                displayText = dashboardSeverityGaugeComponent.getDisplayText();
                break;
            case 'dashboard-benchmark-score':
                dashboardBenchmarkGaugeComponent = <Dashboard_BenchmarkComponent>this.currentChartComponent;
                displayText = dashboardBenchmarkGaugeComponent.getDisplayText();
                break;

            case 'frequency-industry-overview':
                frequencyIndustryOverviewComponent = <Frequency_IndustryOverviewComponent>this.currentChartComponent;
                displayText = frequencyIndustryOverviewComponent.getDisplayText();
                break;
            case 'frequency-time-period':
                frequencyTimePeriodComponent = <Frequency_TimePeriodComponent>this.currentChartComponent;
                displayText = frequencyTimePeriodComponent.getDisplayText();
                break;
            case 'frequency-incident-bar':
                frequencyIncidentBarComponent = <Frequency_IncidentBarComponent>this.currentChartComponent;
                displayText = frequencyIncidentBarComponent.getDisplayText();
                break;
            case 'frequency-incident-pie':
                frequencyIncidentPieComponent = <Frequency_IncidentPieComponent>this.currentChartComponent;
                displayText = frequencyIncidentPieComponent.getDisplayText();
                break;
            case 'frequency-loss-bar':
                frequencyLossBarComponent = <Frequency_LossBarComponent>this.currentChartComponent;
                displayText = frequencyLossBarComponent.getDisplayText();
                break;
            case 'frequency-loss-pie':
                frequencyLossPieComponent = <Frequency_LossPieComponent>this.currentChartComponent;
                displayText = frequencyLossPieComponent.getDisplayText();
                break;

            case 'severity-industry-overview':
                severityIndustryOverviewComponent = <Severity_IndustryOverviewComponent>this.currentChartComponent;
                displayText = severityIndustryOverviewComponent.getDisplayText();
                break;
            case 'severity-time-period':
                severityTimePeriodComponent = <Severity_TimePeriodComponent>this.currentChartComponent;
                displayText = severityTimePeriodComponent.getDisplayText();
                break;
            case 'severity-incident-bar':
                severityIncidentBarComponent = <Severity_IncidentBarComponent>this.currentChartComponent;
                displayText = severityIncidentBarComponent.getDisplayText();
                break;
            case 'severity-incident-pie':
                severityIncidentPieComponent = <Severity_IncidentPieComponent>this.currentChartComponent;
                displayText = severityIncidentPieComponent.getDisplayText();
                break;
            case 'severity-loss-bar':
                severityLossBarComponent = <Severity_LossBarComponent>this.currentChartComponent;
                displayText = severityLossBarComponent.getDisplayText();
                break;
            case 'severity-loss-pie':
                severityLossPieComponent = <Severity_LossPieComponent>this.currentChartComponent;
                displayText = severityLossPieComponent.getDisplayText();
                break;

            case 'app-limit':
                benchmarkLimitComponent = <Benchmark_LimtComponent>this.currentChartComponent;
                displayText = benchmarkLimitComponent.getDisplayText();
                break;
            case 'app-peer-group-loss':
                benchmarkPeerGroupLossComponent = <Benchmark_PeerGroupLossComponent>this.currentChartComponent;
                displayText = benchmarkPeerGroupLossComponent.getDisplayText();
                break;
            case 'app-premium':
                benchmarkPremiumComponent = <Benchmark_PremiumComponent>this.currentChartComponent;
                displayText = benchmarkPremiumComponent.getDisplayText();
                break;
            case 'app-rate':
                benchmarkRateComponent = <Benchmark_RateComponent>this.currentChartComponent;
                displayText = benchmarkRateComponent.getDisplayText();
                break;
            case 'app-retention':
                benchmarkRetentionComponent = <Benchmark_RetentionComponent>this.currentChartComponent;
                displayText = benchmarkRetentionComponent.getDisplayText();
                break;

            default:
                break;
        }
        return displayText;
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
        this.chartDataCollection[this.chartLoadCount].targetPage.setChartCaption(this.chartDataCollection[this.chartLoadCount].pagePosition, this.getCurrentChartComponentText());
        //if the image added is placed beyond the first page we need to update toc
        if(pageOffset > 1) {
            //console.log(this.chartDataCollection[this.chartLoadCount].tocDescription + ' with page type ' + this.chartDataCollection[this.chartLoadCount].targetPage.getPageType() + ' is on page ' + pageOffset);
            this.tocPage.registerTOCPageOffset(this.chartDataCollection[this.chartLoadCount].tocDescription, this.chartDataCollection[this.chartLoadCount].targetPage.getPageType(), pageOffset);
        }
        this.chartLoadCount++;
        this.setPollingInterval(0);
        //console.log('image size = ' + buffer.length);
        let value = Math.round((0.1 + this.chartLoadCount / this.chartDataCollection.length * 0.9) * 100.0);
        this.setDownloadMenuMessage(value + '% done.', value + '%');
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
            if(this.chartLoadCount < this.chartDataCollection.length) {
                this.resetTimer();
                this.loadChartImage();
            } else {
                this.processPageCounts();
            }    
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
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
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
            //console.log('Counting pages for ' + page.getPageType());
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
                //console.log(page.getPageType() + ' has ' + page.getPageCount() + ' page(s).');
                this.processPageCounts();
            });
        } else {
            //console.log('No need to count pages for ' + page.getPageType());
            this.pagesProcessedCount++;
            this.processPageCounts();
        }
    }

    private pdfGenerateTimeout: any = null;

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
        if(!this.isProcessing) {
            this.resetDownloadMenu();
        } else {
            //console.log(pg.getContent());
            this.pdfBuilder.trimLastPageBreak();
            this.filename = this.getPdfFilename();
            //this.pdfMake.createPdf(this.pdfBuilder.getContent()).download(this.getPdfFilename());
            this.setDownloadMenuMessage('100% done', '100%');
            this.pdfDocument = this.pdfMake.createPdf(this.pdfBuilder.getContent());
            this.dialogService.Dismiss();
            //Setup overlay dialog
            this.busyOverlayRef = this.overlayDialog.open({componentData: 'Please wait while we are finalizing the pdf data!'});
            this.pdfGenerateTimeout = setTimeout(() => this.delayedPdfGetBuffer(), 500);
            //console.log(pg.getContent());
        }
    }

    /**
     * Callback that is called after the overlay screen is finished rendering
     * 
     * @private
     * @function delayedPdfGetBuffer
     * @return {} - No return types.
     */
    private delayedPdfGetBuffer() {
        clearTimeout(this.pdfGenerateTimeout);
        this.pdfGenerateTimeout = null;
        this.pdfDocument.getBlob(this.processPdfData.bind(this));
    }

    /**
     * Callback when Assessment Report's data blob is finished
     * 
     * @private
     * @function processPdfData
     * @return {} - No return types.
     */
    private processPdfData(data: any) {
        this.generateMenu.menuName = 'Download ' + this.filename;
        this.fileData = data;
        this.isProcessing = false;
        this.busyOverlayRef.close();
        let componentFactory: ComponentFactory<PdfCompleteComponent> = this.componentFactoryResolver.resolveComponentFactory(PdfCompleteComponent);
        this.snackBarService.Custom(componentFactory.componentType);
    }

    ngOnInit() {}

    private startupTimeout: any = null;

    ngAfterViewInit() {
        let token = null;

        if(this.startupTimeout) {
            clearTimeout(this.startupTimeout);
            this.startupTimeout = null;
        }
        if(this.sessionService) {
            try {
                token = this.sessionService.Token;
            } catch {
                this.sessionService.restoreIdentity();
            }
        }
        if(token) {
            this.fontService.loadFontFiles();
            this.coverPage.setFileService(this.getFileService);
            //Get logged in user's company name
            //this.coverPage.setUserCompanyName('Advisen');
            this.searchService.checkForRevenueAndIndustry(0).subscribe((data)=>{
                if(data && data.message){
                    this.coverPage.setUserCompanyName(data.companyName);
                }
            });
            //Call report glossart service to get glossart structure
            this.getReportGlossaryConfig();
        } else {
            //for refresh of page allow the main content area to load before this loads
            this.startupTimeout = setTimeout(() => this.ngAfterViewInit(), 500);
        }
    }

}
