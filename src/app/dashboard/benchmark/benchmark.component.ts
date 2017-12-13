import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DashboardScoreModel, GaugeChartData, DashboardScore } from 'app/model/model';
import { DashboardService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';
import { ComponentPrintSettings } from 'app/model/pdf.model';

@Component({
  selector: 'dashboard-benchmark-score',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss']
})
export class BenchmarkComponent implements OnInit {

    chartHeader:string = '';
    modelData: DashboardScoreModel;

    setModelData(modelData: DashboardScoreModel) {
        console.log('BenchmarkComponent.setModelData[start]');
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
        console.log('BenchmarkComponent.setModelData[end]');
    }

    chartData: GaugeChartData;

    @Input() componentData: DashboardScore;

    @Input() printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the GaugeChart's required data is built 
     * @param newChartData GaugeChart's required data
     */
    onDataComplete(newChartData : GaugeChartData) {
        console.log('BenchmarkComponent.onDataComplete[start]');
        this.chartData = newChartData;
        console.log('BenchmarkComponent.onDataComplete[end]');
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    public chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
    private isFirstRedrawComplete = new BehaviorSubject<Boolean>(false);
    public isFirstRedrawComplete$: Observable<Boolean> = this.isFirstRedrawComplete.asObservable();
    
    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        console.log('BenchmarkComponent.onChartReDraw[start] isFirstRedrawComplete = ' + this.isFirstRedrawComplete.getValue());
        chart.removeRenderedObjects();
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
        if(!this.isFirstRedrawComplete.getValue()) {
            this.isFirstRedrawComplete.next(true);
        }        
        console.log('BenchmarkComponent.onChartReDraw[end] isFirstRedrawComplete = ' + this.isFirstRedrawComplete.getValue());
    }

    addLabelAndImage(chart: BaseChart){
        chart.addChartLabel(
            this.modelData.displayText,
            (chart.chart.chartWidth * 0.1) - 2,
            chart.chart.chartHeight - 80,
            '#000000',
            10,
            null,
            (chart.chart.chartWidth * 0.75) + 50
        );
        if(this.printSettings == null) {
            chart.addChartImage(
                '../assets/images/advisen-logo.png', 
                chart.chart.chartWidth - 80, 
                chart.chart.chartHeight - 20, 
                69, 
                17
            ); 
        }
    }
    
    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit() {
        this.getBenchmarkData();
    }

    /**
     * Get Benchmark Data from back end nodejs server
     */
    getBenchmarkData() {
        if (this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
            this.dashboardService.getBenchmarkScore(this.componentData.companyId, this.componentData.chartType, this.componentData.limit, this.componentData.retention)
                .subscribe(chartData => this.setModelData(chartData));
            } else {
            this.dashboardService.getBenchmarkScoreByManualInput(this.componentData.chartType, this.componentData.naics, this.componentData.revenueRange, this.componentData.limit, this.componentData.retention)
                .subscribe(chartData => this.setModelData(chartData));
        }
    }        

}
