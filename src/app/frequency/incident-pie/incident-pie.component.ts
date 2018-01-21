import { BaseChart } from '../../shared/charts/base-chart';
import { Component, OnInit, Input } from '@angular/core';
import { FrequencyIncidentPieFlipModel, PieChartData, FrequencyInput, ComponentPrintSettings } from 'app/model/model';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FrequencyService } from 'app/services/frequency.service';

@Component({
  selector: 'frequency-incident-pie',
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

    @Input() componentData: FrequencyInput;
    @Input() incidentChartView: string;
    

    @Input() printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the GaugeChart's required data is built 
     * @param newChartData PieChart's required data
     */
    onDataComplete(newChartData : PieChartData) {
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
        this.chartComponent.next(chart);
        if(this.isDrillDownComplete) {
            this.addLabelAndImage(chart);
            if(!this.isFirstRedrawComplete.getValue()) {
                this.isFirstRedrawComplete.next(true);
            }    
        } else {
            let drillDownFound = false;
            let i: number;
            for(i = 0; i < chart.chart.series[0].data.length; i++) {
                if(chart.chart.series[0].data[i].drilldown === this.printSettings.drillDown) {
                    this.addLabelAndImage(chart);
                    drillDownFound = true;
                    this.isDrillDownComplete = true;
                    chart.chart.series[0].data[i].firePointEvent('click', null);
                    break;
                }
            }
            if(!drillDownFound) {
                this.isDrillDownComplete = true;
                let n = chart.chart.axes.length - 1;
                for(i = n; i >= 0; i--) {
                    chart.chart.axes[i].remove(false);
                }
                n = chart.chart.series.length - 1;
                for(i = n; i >= 0; i--) {
                    chart.chart.series[i].remove(false);
                }
                chart.chart.setTitle({ text: '' }, { text: '' });
                this.modelData.displayText = null;
                chart.chart.redraw();
            }
        }
    }

    addLabelAndImage(chart){
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
    
    constructor(private frequencyService: FrequencyService) {
    }

    ngOnInit() {
        this.getFrequencyData();
        if(this.printSettings && this.printSettings.drillDown) {
            this.isDrillDownComplete = false;
        }
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
