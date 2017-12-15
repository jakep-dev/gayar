import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FrequencyTimePeriodModel, BarChartData, FrequencyInput } from 'app/model/model';
import { FrequencyService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';
import { ComponentPrintSettings } from 'app/model/pdf.model';

@Component({
    selector: 'frequency-time-period',
    templateUrl: './time-period.component.html',
    styleUrls: ['./time-period.component.css']
})
export class TimePeriodComponent implements OnInit {

    chartHeader:string = '';
    modelData: FrequencyTimePeriodModel;

    setModelData(modelData: FrequencyTimePeriodModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: BarChartData;

    @Input() componentData: FrequencyInput;

    @Input() printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
    onDataComplete(newChartData: BarChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    public chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
    private isFirstRedrawComplete = new BehaviorSubject<Boolean>(false);
    public isFirstRedrawComplete$: Observable<Boolean> = this.isFirstRedrawComplete.asObservable();
    private isDrillDownComplete: boolean = true;

    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {        
        chart.removeRenderedObjects();
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
        if(this.isDrillDownComplete) {
            if(!this.isFirstRedrawComplete.getValue()) {
                this.isFirstRedrawComplete.next(true);
            }    
        } else {
            for(let i = 0; i < chart.chart.series[0].data.length; i++) {
                if(chart.chart.series[0].data[i].drilldown === this.printSettings.drillDown) {
                    chart.chart.series[0].data[i].firePointEvent('click', null);
                }
            }
            this.isDrillDownComplete = true;
            if(!this.isFirstRedrawComplete.getValue()) {
                this.isFirstRedrawComplete.next(true);
            }              
        }
    }

    addLabelAndImage(chart: BaseChart){
        let xPos: number;
        if(this.printSettings == null) {
            xPos = 10;
        } else {
            xPos = 45;
        }
        if (this.modelData.maxValue > 0) {
            if(this.modelData.datasets && this.modelData.datasets.length > 0) {
                if(this.modelData.displayText && this.modelData.displayText.length > 0) {
                    let labelHeight = (Math.ceil((this.modelData.displayText.length * 5) / (chart.chart.chartWidth - 85))) * 10;
                    
                    chart.addChartLabel(
                        this.modelData.displayText,
                        xPos,
                        chart.chart.chartHeight - labelHeight,
                        '#000000',
                        10,
                        null,
                        chart.chart.chartWidth - 85
                    );
                }
            }
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
    }

    constructor(private frequencyService: FrequencyService) {
    }

    ngOnInit() {
        this.getBenchmarkLimitData();
        if(this.printSettings && this.printSettings.drillDown) {
            this.isDrillDownComplete = false;
        }
    }

    /**
     * Get Benchmark Limit Data from back end nodejs server
     */
    getBenchmarkLimitData() {
        if (this.componentData) {
            if(this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.frequencyService.getTimePeriodData(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.frequencyService.getTimePeriodData(null, this.componentData.naics, this.componentData.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }

        }
    }

}
