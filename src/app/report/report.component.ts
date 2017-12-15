import { Component, OnInit, ViewChild, ViewContainerRef, ElementRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';

import { BenchmarkComponent as Dashboard_BenchmarkComponent } from 'app/dashboard/benchmark/benchmark.component';
import { FrequencyComponent as Dashboard_FrequencyComponent } from 'app/dashboard/frequency/frequency.component';
import { SeverityComponent as Dashboard_SeverityComponent } from 'app/dashboard/severity/severity.component';

import { IndustryOverviewComponent } from 'app/frequency/industry-overview/industry-overview.component';
import { TimePeriodComponent } from 'app/frequency/time-period/time-period.component';
import { IncidentBarComponent } from 'app/frequency/incident-bar/incident-bar.component';
import { IncidentPieComponent } from 'app/frequency/incident-pie/incident-pie.component';
import { LossBarComponent } from 'app/frequency/loss-bar/loss-bar.component';
import { LossPieComponent } from 'app/frequency/loss-pie/loss-pie.component';

import { MenuService, SearchService, ReportService, FontService, GetFileService } from 'app/services/services';
import { DashboardScore, FrequencyInput, IReportTileModel, ISubComponentModel, IChartMetaData } from 'app/model/model';

import { 
    BasePage, CoverPage, DashboardPage, TOCPage, FrequencyIndustryOverviewPage, 
    FrequencyTimePeriodPage, FrequencyTypeOfIncidentPage, FrequencyDataPrivacyPage, 
    FrequencyNetworkSecurityPage, FrequencyTechEOPage, FrequencyPrivacyViolationsPage, 
    FrequencyTypeOfLossPage, FrequencyPersonalInformationPage, FrequencyCorporateLossesPage
} from 'app/pdf-download/pages/pages'

import { PDFMakeBuilder } from 'app/pdf-download/pdfMakeBuilder';

import { BaseChart } from 'app/shared/charts/base-chart';
import { ComponentPrintSettings } from 'app/model/pdf.model';
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
        IndustryOverviewComponent,
        TimePeriodComponent,
        IncidentBarComponent,
        IncidentPieComponent,
        LossBarComponent,
        LossPieComponent
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

    processReportSection(section: IReportTileModel) {
        if(section.value) {
            this.tocPage.addTocEntry(section.description, 1, section.subComponents[0].pageType);
            section.subComponents.forEach(reportSectionItem => {
                if(reportSectionItem.value) {
                    console.log(reportSectionItem.description);
                    this.tocPage.addTocEntry(reportSectionItem.description, 2, reportSectionItem.pageType);
                    if(!this.hasPageType(reportSectionItem.pageType)) {
                        this.addPageType(reportSectionItem.pageType);
                        console.log('Page type = ' + reportSectionItem.pageType);
                    }
                    let n: number;
                    let i: number;
                    n = reportSectionItem.chartComponents.length;
                    for(i = 0; i < n; i++) {
                        this.chartDataCollection.push(
                            {
                                chartSetting: reportSectionItem.chartComponents[i],
                                imageData: '',
                                imageIndex: reportSectionItem.chartComponents[i].componentName + '_' + this.chartDataCollection.length,
                                pagePosition: reportSectionItem.chartComponents[i].pagePosition,
                                targetPage: this.pageCollection[reportSectionItem.pageType]
                            }
                        );
                    }
                    if(reportSectionItem.subSubComponents) {
                      reportSectionItem.subSubComponents.forEach(reportSubSectionItem => {
                          if(reportSubSectionItem.value) {
                              console.log(reportSubSectionItem.description);
                              this.tocPage.addTocEntry(reportSubSectionItem.description, 3, reportSubSectionItem.pageType);
                              if(!this.hasPageType(reportSubSectionItem.pageType)) {
                                  this.addPageType(reportSubSectionItem.pageType);
                                  console.log('Page type = ' + reportSubSectionItem.pageType);
                              }

                              n = reportSubSectionItem.chartComponents.length;
                              for(i = 0; i < n; i++) {
                                this.chartDataCollection.push(
                                      {
                                          chartSetting: reportSubSectionItem.chartComponents[i],
                                          imageData: '',
                                          imageIndex: reportSubSectionItem.chartComponents[i].componentName + '_' + this.chartDataCollection.length,
                                          pagePosition: reportSubSectionItem.chartComponents[i].pagePosition,
                                          targetPage: this.pageCollection[reportSubSectionItem.pageType]
                                      }
                                  );
                              }
                          }
                      });
                    }
                }
            });
            //console.log(this.chartDataCollection);
            if(this.chartDataCollection.length > 0) {
                this.loadChartImage();
            }
        }
    }
    
    loadChartImage() {
        let componentFactory: ComponentFactory<any>;
        
        let dashboardBenchmarkGaugeComponent: Dashboard_BenchmarkComponent;
        let dashboardFrequencyGaugeComponent: Dashboard_FrequencyComponent;
        let dashboardSeverityGaugeComponent: Dashboard_SeverityComponent;
        let industryOverviewComponent: IndustryOverviewComponent;
        let timePeriodComponent: TimePeriodComponent;
        let incidentBarComponent: IncidentBarComponent;
        let incidentPieComponent: IncidentPieComponent;
        let lossBarComponent: LossBarComponent;
        let lossPieComponent: LossPieComponent;

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
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(IndustryOverviewComponent);
                industryOverviewComponent = <IndustryOverviewComponent>this.entryPoint.createComponent(componentFactory).instance;
                industryOverviewComponent.componentData = this.frequencyInput;
                industryOverviewComponent.printSettings = this.printSettings;
                industryOverviewComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                industryOverviewComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-time-period':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(TimePeriodComponent);
                timePeriodComponent = <TimePeriodComponent>this.entryPoint.createComponent(componentFactory).instance;
                timePeriodComponent.componentData = this.frequencyInput;
                timePeriodComponent.printSettings = this.printSettings;
                timePeriodComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                timePeriodComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-incident-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(IncidentBarComponent);
                incidentBarComponent = <IncidentBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                incidentBarComponent.componentData = this.frequencyInput;
                incidentBarComponent.printSettings = this.printSettings;
                incidentBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                incidentBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-incident-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(IncidentPieComponent);
                incidentPieComponent = <IncidentPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                incidentPieComponent.componentData = this.frequencyInput;
                incidentPieComponent.printSettings = this.printSettings;
                incidentPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                incidentPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-loss-bar':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(LossBarComponent);
                lossBarComponent = <LossBarComponent>this.entryPoint.createComponent(componentFactory).instance;
                lossBarComponent.componentData = this.frequencyInput;
                lossBarComponent.printSettings = this.printSettings;
                lossBarComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                lossBarComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
                break;
            case 'frequency-loss-pie':
                componentFactory = this.componentFactoryResolver.resolveComponentFactory(LossPieComponent);
                lossPieComponent = <LossPieComponent>this.entryPoint.createComponent(componentFactory).instance;
                lossPieComponent.componentData = this.frequencyInput;
                lossPieComponent.printSettings = this.printSettings;
                lossPieComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
                lossPieComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
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
          //first page is the cover sheet, second page is the table of contents
          //start at page 3
          let pageNumber = 3;
          this.pageOrder.forEach(pageType => 
              {
                  this.tocPage.setPageNumber(pageType, pageNumber);
                  pageNumber++;
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
          console.log(pg.getContent());
          this.pdfMake.createPdf(pg.getContent()).download('test.pdf');
          console.log(pg.getContent());
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
            default:
                break;
        }
    }
}
