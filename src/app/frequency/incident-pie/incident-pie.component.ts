import {BaseChart} from '../../shared/charts/base-chart';
import { Component, OnInit, Input } from '@angular/core';
import { FrequencyIncidentPieFlipModel, PieChartData, FrequencyIncidentPieFlipData } from 'app/model/model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FrequencyService } from 'app/services/frequency.service';

@Component({
  selector: 'app-incident-pie',
  templateUrl: './incident-pie.component.html',
  styleUrls: ['./incident-pie.component.css']
})
export class IncidentPieComponent implements OnInit {

  
 
    chartHeader : string = '';

    modelData: FrequencyIncidentPieFlipModel;

    setModelData(modelData: FrequencyIncidentPieFlipModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: PieChartData;

    @Input() componentData: FrequencyIncidentPieFlipData;

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
            this.frequencyService.getTypeOfIncidentFlipDetailDataset(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
                .subscribe(chartData => this.setModelData(chartData));
            }
    }     



}
