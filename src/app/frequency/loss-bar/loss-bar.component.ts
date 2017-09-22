import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FrequencyLossBarModel, BarChartData, FrequencyInput } from 'app/model/model';
import { FrequencyService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
    selector: 'app-loss-bar',
    templateUrl: './loss-bar.component.html',
    styleUrls: ['./loss-bar.component.css']
})
export class LossBarComponent implements OnInit {

    chartHeader:string = '';
    modelData: FrequencyLossBarModel;

    setModelData(modelData: FrequencyLossBarModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: BarChartData;

    @Input() componentData: FrequencyInput;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
    onDataComplete(newChartData: BarChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();

    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {        
        this.chartComponent.next(chart);
    }

    constructor(private frequencyService: FrequencyService) {
    }

    ngOnInit() {
        this.getBenchmarkLimitData();
    }

    /**
     * Get Benchmark Limit Data from back end nodejs server
     */
    getBenchmarkLimitData() {
        if (this.componentData) {
            this.frequencyService.getTypeOfLossBarData(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));

        }
    }

}
