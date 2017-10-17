import { Component, OnInit, Input } from '@angular/core';
import { FrequencyService } from 'app/services/services';
import { BaseChart } from 'app/shared/charts/base-chart';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PieChartData, FrequencyLossPieFlipData, FrequencyLossPieFlipModel } from 'app/model/model';

@Component({
  selector: 'frequency-loss-pie',
  templateUrl: './loss-pie.component.html',
  styleUrls: ['./loss-pie.component.css']
})
export class LossPieComponent implements OnInit {

    chartHeader : string = '';

    modelData: FrequencyLossPieFlipModel;

    setModelData(modelData: FrequencyLossPieFlipModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: PieChartData;

    @Input() componentData: FrequencyLossPieFlipData;

    /**
     * Event handler to indicate the construction of the GaugeChart's required data is built 
     * @param newChartData PieChart's required data
     */
    onDataComplete(newChartData : PieChartData) {
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
        this.getFrequencyData();
    }

    /**
     * Get Frequency Data from back end nodejs server
     */
    getFrequencyData() {
        if (this.componentData) {
            this.frequencyService.getTypeOfLossFlipDetailDataset(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
                .subscribe(chartData => this.setModelData(chartData));
            }
    }     




}
