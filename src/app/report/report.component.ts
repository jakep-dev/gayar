import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

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
    ReportService, FontService, GetFileService 
} from 'app/services/services';

import { 
    DashboardScore, 
    FrequencyInput, FrequencyDataModel, FrequencyDataResponseModel,
    SeverityInput, SeverityDataModel, SeverityDataResponseModel,
    BenchmarkDistributionInput, BenchmarkLimitAdequacyInput, BenchmarkRateInput, ComponentPrintSettings,
    IReportTileModel, ISubComponentModel, IChartMetaData, IChartWidget
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
    SeverityTopPeerGroupLossesPage, SeverityTopCompanyLossesPage
} from 'app/pdf-download/pages/pages'

import { PDFMakeBuilder } from 'app/pdf-download/pdfMakeBuilder';

import { BaseChart } from 'app/shared/charts/base-chart';
import { canvasFactory } from 'app/shared/pdf/pdfExport';
import { getPdfMake } from 'app/shared/pdf/pdfExport';

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

    public reportTileModel: Array<IReportTileModel> = null;
    private pageCollection: Array<BasePage> = [];
    private pageOrder: Array<string> = [];

    private chartDataCollection: Array<IChartMetaData> = [];
    private chartLoadCount: number;
    private pagesProcessedCount: number;

    @ViewChild('entryPoint', { read: ViewContainerRef }) entryPoint: ViewContainerRef;
    
    @ViewChild('canvas') canvas: ElementRef;

    private searchType: string;
    private companyId: number;
    private naics: string;
    private revenueRange: string;
    private getDashboardScoreByManualInput: DashboardScore;
    private frequencyInput: FrequencyInput;
    private frequencyPeerGroupTable: Array<FrequencyDataModel>;
    private frequencyCompanyLossesTable: Array<FrequencyDataModel>;
    private severityInput: SeverityInput;
    private severityPeerGroupTable: Array<SeverityDataModel>;
    private severityCompanyLossesTable: Array<SeverityDataModel>;
    private benchmarkDistributionInput: BenchmarkDistributionInput;
    private benchmarkLimitAdequacyInput: BenchmarkLimitAdequacyInput;
    private benchmarkRateInput: BenchmarkRateInput;
    private printSettings: ComponentPrintSettings;
    
    private chart: BaseChart;

    private pdfMake: any;

    private coverPage: CoverPage;
    private tocPage: TOCPage;

    private reportDataDone: boolean = false;
    private frequencyDataDone: boolean = false;
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
        private reportService: ReportService) {

        if(this.fontService.isLoadComplete()) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
            console.log('Font files already loaded!');
        } else {
            this.fontService.loadCompleted$.subscribe(this.configurePDFMake.bind(this));
        }

        this.coverPage = new CoverPage();
        this.coverPage.setFileService(this.getFileService);

        this.tocPage = new TOCPage();
    }

    private configurePDFMake(isReady: boolean) {
        if(isReady) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
            console.log('Font files loaded!');
        }
    }

    ngOnInit() {
        this.menuService.breadCrumb = 'Report';
        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null; 

        this.coverPage.setCompanyName((this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) ? this.searchService.selectedCompany.companyName : this.searchService.searchCriteria.value);
        if(this.naics) {
            this.coverPage.setIndustryName(this.naics);
        }
        if(this.revenueRange) {
            this.coverPage.setRevenueRangeText(this.revenueRange);
        }

        //this.coverPage.setUserCompanyName('Advisen');
        this.searchService.checkForRevenueAndIndustry(0).subscribe((data)=>{
            if(data && data.message){
                this.coverPage.setUserCompanyName(data.companyName);
            }
        });
        
        
        this.setupChartInput();
        this.getReportConfig();
        this.getFrequencyTables();
        this.getSeverityTables();
    }

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
     * @return {} - No return types.
     */
    private getReportConfig () {
        this.reportService.getReportConfig().subscribe((data)=> {
            this.reportTileModel = data;
            console.log('Report Data Done!');
            this.reportDataDone = true;
        });
    }

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

    private clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            console.log('Deleting key ' + item);
            delete array[item];
        }
    }

    public onReport () {
        if(this.pdfMake && this.coverPage.isCoverPageLoaded() && this.reportDataDone && this.frequencyDataDone && this.severityDataDone) {
            this.startReportProcess();
        } else {
            console.log('Waiting for resources to load before starting report.');
            setTimeout(this.onReport.bind(this), 1000);
        }

    }

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
        if(this.chartDataCollection.length > 0) {
            this.loadChartImage();
        } else if(this.pageOrder.length > 0) {
            this.processPageCounts();
        }
    }

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

        let chartData: IChartMetaData = this.chartDataCollection[this.chartLoadCount];
        //console.log('Processing page ' + chartData.targetPage.getPageType());
        this.printSettings = chartData.targetPage.getPrintSettings(chartData.pagePosition);
        this.printSettings.drillDown = chartData.chartSetting.drillDownName;
        this.canvas.nativeElement.width = this.printSettings.width;
        this.canvas.nativeElement.height = this.printSettings.height;
        this.entryPoint.clear();
        
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

    private setWorkingChart(chart: BaseChart) {
        this.chart = chart;
    }

    private startImageConversion(start: boolean) {
        if(start && this.chart != null) {
            setTimeout(this.loadCurrentChartImage.bind(this), 1000);
        }
    }

    private loadCurrentChartImage() {

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
        }
    }

  private renderCompleteCallback() {
        let buffer = this.canvas.nativeElement.toDataURL('image/png');
        this.canvas.nativeElement.getContext('2d').clearRect(0, 0, this.printSettings.width, this.printSettings.height);
        this.entryPoint.clear();
        this.chartDataCollection[this.chartLoadCount].imageData = buffer;
        let pageOffset = this.chartDataCollection[this.chartLoadCount].targetPage.addChartLabel(this.chartDataCollection[this.chartLoadCount].pagePosition, this.chartDataCollection[this.chartLoadCount].imageIndex, this.chartDataCollection[this.chartLoadCount].imageData);
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
    private calculatePageCount(page: BasePage) {
        if(page.isPageCountingRequired()) {
            console.log('Counting pages for ' + page.getPageType());
            let pg = new PDFMakeBuilder();
            pg.setDifferentFirstPage(true);
            pg.addPage(page);
            const pdfDocGenerator = this.pdfMake.createPdf(pg.getContent());
            pdfDocGenerator.getBuffer((data) => {
                this.pagesProcessedCount++;
                //subtract one from the page count due to page break
                page.setPageCount(pg.getPageCount() - 1 );
                console.log(page.getPageType() + ' has ' + page.getPageCount() + ' page(s).');
                this.processPageCounts();
            });    
        } else {
            console.log('No need to count pages for ' + page.getPageType());
            this.pagesProcessedCount++;
            this.processPageCounts();
        }
    }

    private generatePDF() {


        //first page is the cover sheet, second to third page is the table of contents
        let pageNumber = 2 + this.tocPage.getPageCount();
        this.pageOrder.forEach(pageType => 
            {
                this.tocPage.setPageNumber(pageType, pageNumber);
                pageNumber = pageNumber + this.pageCollection[pageType].getPageCount();
            }
        );
        let pg = new PDFMakeBuilder();
        pg.setDifferentFirstPage(true);
        pg.addPage(this.coverPage);
        pg.addPage(this.tocPage);
        this.pageOrder.forEach(pageType => 
            {
                pg.addPage(this.pageCollection[pageType]);
            }
        );
        //console.log(pg.getContent());
        this.pdfMake.createPdf(pg.getContent()).download('test.pdf');
        //console.log(pg.getContent());
    }

    private hasPageType(pageType: string):boolean {
        return (this.pageCollection[pageType] ? true : false);
    }

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
                this.pageCollection[pageType] = new FrequencyTimePeriodPage();
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
                this.pageCollection[pageType] = new SeverityTimePeriodPage();
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
                frequencyMostRecentPeerGroupLossesPage.setPeerGroupData(this.frequencyPeerGroupTable);
                this.pageCollection[pageType] = frequencyMostRecentPeerGroupLossesPage
                this.pageOrder.push(pageType);
                break;
            case FrequencyMostRecentCompanyLossesPage.pageType:
                let frequencyMostRecentCompanyLossesPage = new FrequencyMostRecentCompanyLossesPage();
                frequencyMostRecentCompanyLossesPage.setPeerGroupData(this.frequencyCompanyLossesTable);
                this.pageCollection[pageType] = frequencyMostRecentCompanyLossesPage
                this.pageOrder.push(pageType);
                break;

            case SeverityTopPeerGroupLossesPage.pageType:
                let severityTopPeerGroupLossesPage = new SeverityTopPeerGroupLossesPage();
                severityTopPeerGroupLossesPage.setPeerGroupData(this.severityPeerGroupTable);
                this.pageCollection[pageType] = severityTopPeerGroupLossesPage
                this.pageOrder.push(pageType);
                break;
            case SeverityTopCompanyLossesPage.pageType:
                let severityTopCompanyLossesPage = new SeverityTopCompanyLossesPage();
                severityTopCompanyLossesPage.setPeerGroupData(this.severityCompanyLossesTable);
                this.pageCollection[pageType] = severityTopCompanyLossesPage
                this.pageOrder.push(pageType);
                break;

            default:
                break;
        }
    }
}
