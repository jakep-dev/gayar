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

import { 
    MenuService, SearchService, 
    FrequencyService, SeverityService, ApplicationService,
    ReportService, FontService, GetFileService,
    SessionService
} from 'app/services/services';

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
import { BaseChart } from 'app/shared/charts/base-chart';
import { canvasFactory } from 'app/shared/pdf/pdfExport';
import { getPdfMake } from 'app/shared/pdf/pdfExport';
import { APPCONSTANTS } from 'app/app.const';

@Component({
    selector: 'pdf-download',
    templateUrl: 'pdf-download.component.html',
    styleUrls: ['./pdf-download.component.scss'],
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
export class PdfDownloadComponent implements OnInit {

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
    private frequencyPeerGroupTable: Array<FrequencyDataModel>;
    
    //input to frequency most recent company losses table
    private frequencyCompanyLossesTable: Array<FrequencyDataModel>;

    //boolean to indicate frequency data is loaded
    private frequencyDataDone: boolean = false;

    //input to severity top peer group losses table
    private severityPeerGroupTable: Array<SeverityDataModel>;

    //input to severity top company losses table
    private severityCompanyLossesTable: Array<SeverityDataModel>;

    //boolean to indicate severity data is loaded
    private severityDataDone: boolean = false;

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

    constructor(
        private rootElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private fontService: FontService,
        private getFileService: GetFileService,
        private searchService: SearchService,
        private frequencyService: FrequencyService,
        private severityService: SeverityService,
        private reportService: ReportService,
        private  applicationService: ApplicationService,
        private sessionService: SessionService
    ) {
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

        //Get logged in user's company name
        //this.coverPage.setUserCompanyName('Advisen');
        this.searchService.checkForRevenueAndIndustry(0).subscribe((data)=>{
            if(data && data.message){
                this.coverPage.setUserCompanyName(data.companyName);
            }
        });

        //Call report glossart service to get glossart structure
        this.getReportGlossaryConfig();

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
     * Starts the pdf generation process based on search input, report selections and user's permissions
     * 
     * @private
     * @function buildPdf
     * @param {Array<IReportTileModel} reportSelections - input user selections and permission settings based on user's login
     * @return {} - No return types.
     */
    public buildPdf(reportSelections: Array<IReportTileModel>) {

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
        this.getFrequencyTables();
        //Call severity service to get severity table data
        this.getSeverityTables();
    }

    ngOnInit() {
    }

}
