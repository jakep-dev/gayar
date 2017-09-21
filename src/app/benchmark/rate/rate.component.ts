import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkRateModel, BoxPlotChartData, BenchmarkRateInput } from 'app/model/model';
import { BenchmarkService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

    chartHeader:string = '';
    modelData: BenchmarkRateModel;

    setModelData(modelData: BenchmarkRateModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: BoxPlotChartData;

    @Input() componentData: BenchmarkRateInput;

    /**
     * Event handler to indicate the construction of the BoxPlotChart's required data is built 
     * @param newChartData BoxPlotChart's required data
     */
    onDataComplete(newChartData : BoxPlotChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
    
    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        //this.chartComponent = chart;
        this.chartComponent.next(chart);
    }

    constructor(private benchmarkService: BenchmarkService) {
    }

    ngOnInit() {
        this.getBenchmarkRateData();
    }

    /**
     * Get Benchmark Rate Data from back end nodejs server
     */
    getBenchmarkRateData() {
        if(this.componentData) {
            this.benchmarkService.getRatePerMillion(this.componentData.companyId, this.componentData.premiumValue, this.componentData.limitValue, this.componentData.revenueRange, this.componentData.naics)
            .subscribe(modelData => this.setModelData(modelData));            
        }
    }

}
