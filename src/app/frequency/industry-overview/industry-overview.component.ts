import {BaseChart} from '../../shared/charts/base-chart';
import {BarChartData} from '../../model/charts/bar-chart.model';
import { Component, OnInit, Input } from '@angular/core';
import { FrequencyIndustryOverviewModel, FrequencyIndustryOverviewInput } from "app/model/model";
import { FrequencyService } from "app/services/services";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-industry-overview',
  templateUrl: './industry-overview.component.html',
  styleUrls: ['./industry-overview.component.css']
})
export class IndustryOverviewComponent implements OnInit {
  
    modelData: FrequencyIndustryOverviewModel;
    chartHeader : string;

    setModelData(modelData: FrequencyIndustryOverviewModel) {
        this.modelData = modelData;
        this.chartHeader = modelData.chartTitle;
    }

    chartData: BarChartData;

    @Input() componentData: FrequencyIndustryOverviewInput;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
    onDataComplete(newChartData : BarChartData) {
        this.chartData = newChartData;
    }

    chartComponent: BaseChart

    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        this.chartComponent = chart;
    }

    constructor(private frequencyService: FrequencyService) {
    }

    ngOnInit() {
        this.getFrequencyIndustryOverViewData();
    }

    /**
     * Get Frequency Industry Overview Data from back end nodejs server
     */
    getFrequencyIndustryOverViewData() {     
        if(this.componentData) {           
          this.frequencyService.getFrequencyIndustryOverview(this.componentData.companyId, this.componentData.naics)
          .subscribe(modelData => this.setModelData(modelData));            
        }
    }

}
