import { BaseChart }  from '../../shared/charts/base-chart';
import { BarChartData } from '../../model/charts/bar-chart.model';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FrequencyIndustryOverviewModel, FrequencyInput } from "app/model/model";
import { FrequencyService } from "app/services/services";
import { Observable } from 'rxjs/Observable';
import { ComponentPrintSettings } from 'app/model/pdf.model';

@Component({
  selector: 'frequency-industry-overview',
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

    @Input() componentData: FrequencyInput;

    @Input() printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
    onDataComplete(newChartData : BarChartData) {
        this.chartData = newChartData;
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
        chart.removeRenderedObjects();
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
        if(!this.isFirstRedrawComplete.getValue()) {
            this.isFirstRedrawComplete.next(true);
        }
    }

    addLabelAndImage(chart: BaseChart) {
        let xPos: number;
        if(this.printSettings == null) {
            xPos = 10;
        } else {
            xPos = 45;
        }
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
