import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

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

import { MenuService, SearchService, ReportService, FontService, GetFileService } from 'app/services/services';

import { 
    DashboardScore, FrequencyInput, SeverityInput, ComponentPrintSettings,
    IReportTileModel, ISubComponentModel, IChartMetaData, IChartWidget
} from 'app/model/model';

import { 
    BasePage, CoverPage, DashboardPage, TOCPage, FrequencyIndustryOverviewPage, 
    FrequencyTimePeriodPage, FrequencyTypeOfIncidentPage, FrequencyDataPrivacyPage, 
    FrequencyNetworkSecurityPage, FrequencyTechEOPage, FrequencyPrivacyViolationsPage, 
    FrequencyTypeOfLossPage, FrequencyPersonalInformationPage, FrequencyCorporateLossesPage,
    SeverityIndustryOverviewPage, SeverityTimePeriodPage, SeverityTypeOfIncidentPage,
    SeverityDataPrivacyPage, SeverityNetworkSecurityPage, SeverityTechEOPage,
    SeverityPrivacyViolationsPage, SeverityTypeOfLossPage, SeverityPersonalInformationPage,
    SeverityCorporateLossesPage
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
        Severity_LossPieComponent
    ]
})
export class ReportComponent implements OnInit {

    reportTileModel: Array<IReportTileModel> = null;
    pageCollection: Array<BasePage> = [];
    pageOrder: Array<string> = [];

    chartDataCollection: Array<IChartMetaData> = [];
    chartLoadCount: number;

    @ViewChild('entryPoint', { read: ViewContainerRef }) entryPoint: ViewContainerRef;
    
    @ViewChild('canvas') canvas: ElementRef;

    public searchType: string;
    public companyId: number;
    public naics: string;
    public revenueRange: string;
    public getDashboardScoreByManualInput: DashboardScore;
    public frequencyInput: FrequencyInput;
    public severityInput: SeverityInput;
    public printSettings: ComponentPrintSettings;
    
    private chart: BaseChart;

    private pdfMake: any;

    private coverPage: CoverPage;
    private tocPage: TOCPage;
    
    constructor(
        private rootElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private fontService: FontService,
        private getFileService: GetFileService,
        private menuService: MenuService,
        private searchService: SearchService,
        private reportService: ReportService) {

        if(this.fontService.isLoadComplete()) {
            this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
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
        this.coverPage.setUserCompanyName('Advisen');
        
        this.setupDashboardScoreInput();
        this.getReportConfig();
    }

    setupDashboardScoreInput() {
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
    }

    /**
     * getReportConfig - Load the report configuration.
     *
     * @return {} - No return types.
     */
    getReportConfig () {
        this.reportService.getReportConfig().subscribe((data)=> {
            this.reportTileModel = data;
            //console.log(this.reportTileModel[0].subComponents)
        });
    }

    private clearArray(array: Array<any>) {
        array.length = 0;
        for(let item in array) {
            console.log('Deleting key ' + item);
            delete array[item];
        }
    }

    onReport () {
        //console.log(this.reportTileModel);
        this.chartLoadCount = 0;
        this.chartDataCollection.length = 0;
        this.pageOrder.length = 0;
        this.clearArray(this.pageCollection);
        this.tocPage.clearTOC();
        this.reportTileModel.forEach(reportSection => {
            if(reportSection.value) {
                this.processReportSection(reportSection);
            }
        });
    }

    private loadChartCollection(chartComponents:IChartWidget[], pageType: string) {
        let n: number;
        let i: number;

        if(!this.hasPageType(pageType)) {
            this.addPageType(pageType);
            console.log('Loaded Page type ' + pageType);
        }
        n = chartComponents.length;
        for(i = 0; i < n; i++) {
            this.chartDataCollection.push(
                {
                    chartSetting: chartComponents[i],
                    imageData: '',
                    imageIndex: chartComponents[i].componentName + '_' + this.chartDataCollection.length,
                    pagePosition: chartComponents[i].pagePosition,
                    targetPage: this.pageCollection[pageType]
                }
            );
        }
    }

    processReportSection(section: IReportTileModel) {
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
                this.loadChartCollection(subComponentItem.chartComponents, subComponentItem.pageType);
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
                            this.loadChartCollection(subComponentItem.chartComponents, subComponentItem.pageType);
                            subEntryAdded = true;
                        }
                        console.log('Sub Sub Component = ' + subSubComponentItem.description + ' pageType = ' + subSubComponentItem.pageType);
                        this.tocPage.addTocEntry(subSubComponentItem.description, 3, subSubComponentItem.pageType);
                        this.loadChartCollection(subSubComponentItem.chartComponents, subSubComponentItem.pageType);
                    }
                });
            }
            
        });
        //console.log(this.chartDataCollection);
        if(this.chartDataCollection.length > 0) {
            this.loadChartImage();
        }
    }
    
    loadChartImage() {
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


        let chartData: IChartMetaData = this.chartDataCollection[this.chartLoadCount];
        console.log(chartData.targetPage.getPrefix());
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

            default:
                break;
        }
    }

    setWorkingChart(chart: BaseChart) {
        this.chart = chart;
    }

    startImageConversion(start: boolean) {
        if(start && this.chart != null) {
            setTimeout(this.loadCurrentChartImage.bind(this), 500);
        }
    }

    loadCurrentChartImage() {

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

  renderCompleteCallback() {
      let buffer = this.canvas.nativeElement.toDataURL('image/png');
      this.canvas.nativeElement.getContext('2d').clearRect(0, 0, this.printSettings.width, this.printSettings.height);
      this.entryPoint.clear();
      this.chartDataCollection[this.chartLoadCount].imageData = buffer;
      this.chartDataCollection[this.chartLoadCount].targetPage.addChartLabel(this.chartDataCollection[this.chartLoadCount].pagePosition, this.chartDataCollection[this.chartLoadCount].imageIndex, this.chartDataCollection[this.chartLoadCount].imageData);
      this.chartLoadCount++;
      console.log('image size = ' + buffer.length);
      if(this.chartLoadCount < this.chartDataCollection.length) {
          this.loadChartImage();
      } else {
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
  }

    hasPageType(pageType: string):boolean {
        return (this.pageCollection[pageType] ? true : false);
    }

    addPageType(pageType: string) {
        switch(pageType) {
            case 'DashboardPage':
                this.pageCollection[pageType] = new DashboardPage();
                this.pageOrder.push(pageType);
                break;

            case 'FrequencyIndustryOverviewPage':
                this.pageCollection[pageType] = new FrequencyIndustryOverviewPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyTimePeriodPage':
                this.pageCollection[pageType] = new FrequencyTimePeriodPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyTypeOfIncidentPage':
                this.pageCollection[pageType] = new FrequencyTypeOfIncidentPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyDataPrivacyPage':
                this.pageCollection[pageType] = new FrequencyDataPrivacyPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyNetworkSecurityPage':
                this.pageCollection[pageType] = new FrequencyNetworkSecurityPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyTechEOPage':
                this.pageCollection[pageType] = new FrequencyTechEOPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyPrivacyViolationsPage':
                this.pageCollection[pageType] = new FrequencyPrivacyViolationsPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyTypeOfLossPage':
                this.pageCollection[pageType] = new FrequencyTypeOfLossPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyPersonalInformationPage':
                this.pageCollection[pageType] = new FrequencyPersonalInformationPage();
                this.pageOrder.push(pageType);
                break;
            case 'FrequencyCorporateLossesPage':
                this.pageCollection[pageType] = new FrequencyCorporateLossesPage();
                this.pageOrder.push(pageType);
                break;

            case 'SeverityIndustryOverviewPage':
                this.pageCollection[pageType] = new SeverityIndustryOverviewPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityTimePeriodPage':
                this.pageCollection[pageType] = new SeverityTimePeriodPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityTypeOfIncidentPage':
                this.pageCollection[pageType] = new SeverityTypeOfIncidentPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityDataPrivacyPage':
                this.pageCollection[pageType] = new SeverityDataPrivacyPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityNetworkSecurityPage':
                this.pageCollection[pageType] = new SeverityNetworkSecurityPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityTechEOPage':
                this.pageCollection[pageType] = new SeverityTechEOPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityPrivacyViolationsPage':
                this.pageCollection[pageType] = new SeverityPrivacyViolationsPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityTypeOfLossPage':
                this.pageCollection[pageType] = new SeverityTypeOfLossPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityPersonalInformationPage':
                this.pageCollection[pageType] = new SeverityPersonalInformationPage();
                this.pageOrder.push(pageType);
                break;
            case 'SeverityCorporateLossesPage':
                this.pageCollection[pageType] = new SeverityCorporateLossesPage();
                this.pageOrder.push(pageType);
                break;

            default:
                break;
        }
    }
}
