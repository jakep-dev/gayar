import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, ElementRef, OnInit } from '@angular/core';
import { FADE_ANIMATION} from 'app/shared/animations/animations';
import { SearchService, MenuService, FontService } from 'app/services/services';
import {DashboardScore} from 'app/model/model';
import { BaseChart } from 'app/shared/charts/base-chart';
import { FrequencyComponent } from 'app/dashboard/frequency/frequency.component';
import { ComponentPrintSettings } from 'app/model/pdf.model';
import { canvasFactory } from 'app/shared/pdf/pdfExport';
import { getPdfMake } from 'app/shared/pdf/pdfExport';

@Component({
    selector: 'pdf-download',
    templateUrl: 'pdf-download.component.html',
    styleUrls: ['./pdf-download.component.scss'],
    entryComponents: [FrequencyComponent],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class PdfDownloadComponent implements OnInit {

    private pdfMake: any;

    public searchType: string;
    public companyId: number;
    public naics: string;
    public revenueRange: string;

    public getDashboardScoreByManualInput: DashboardScore;

    public printSettings: ComponentPrintSettings;

    private chart: BaseChart;

    @ViewChild('entryPoint', { read: ViewContainerRef }) entryPoint: ViewContainerRef;

    @ViewChild('canvas') canvas: ElementRef;

    //@ViewChild('img') img: ElementRef;

    constructor(private fontService: FontService,
        private rootElement: ElementRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private searchService: SearchService, 
        private menuService: MenuService) {

        this.menuService.breadCrumb = 'Dashboard';
    }

    /**
     * create benchmark score chart input
     */
    setupDashboardScoreInput() {
        this.searchType = this.searchService.searchCriteria.type;
        if (this.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.companyId = this.searchService.selectedCompany.companyId;
        } else {
            this.companyId = null;
        }

        this.naics = (this.searchService.searchCriteria.industry && this.searchService.searchCriteria.industry.naicsDescription)? this.searchService.searchCriteria.industry.naicsDescription: null;
        this.revenueRange = (this.searchService.searchCriteria.revenue && this.searchService.searchCriteria.revenue.rangeDisplay)? this.searchService.searchCriteria.revenue.rangeDisplay : null; 

        this.getDashboardScoreByManualInput = {
            searchType: this.searchType,
            chartType: 'BENCHMARK',
            companyId: this.companyId,
            naics: this.naics,
            revenueRange: this.revenueRange,
            limit : this.searchService.searchCriteria.limit,
            retention: this.searchService.searchCriteria.retention,
        };
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
        //this.img.nativeElement.src = buffer;
        //console.log(buffer);
        //console.log(this.pdfMake);

        console.log('image size = ' + buffer.length);
    }

    ngOnInit() {
        this.pdfMake = getPdfMake(this.fontService.getFontFiles(), this.fontService.getFontNames());
        this.setupDashboardScoreInput();

        this.printSettings = {
            width: 600,
            height: 400
        };

        this.canvas.nativeElement.width = this.printSettings.width;
        this.canvas.nativeElement.height = this.printSettings.height;
  
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(FrequencyComponent);
        this.entryPoint.clear();
        const frequencyGaugeComponent = <FrequencyComponent>this.entryPoint.createComponent(componentFactory).instance;
        frequencyGaugeComponent.componentData = this.getDashboardScoreByManualInput;
        frequencyGaugeComponent.printSettings = this.printSettings;
        frequencyGaugeComponent.chartComponent$.subscribe(this.setWorkingChart.bind(this));
        frequencyGaugeComponent.isFirstRedrawComplete$.subscribe(this.startImageConversion.bind(this));
    }

}
