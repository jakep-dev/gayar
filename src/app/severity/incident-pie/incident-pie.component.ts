import { Component, OnInit, Input } from '@angular/core';
import { SeverityService } from 'app/services/services';
import { BaseChart } from 'app/shared/charts/base-chart';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PieChartData, SeverityInput, SeverityIncidentPieFlipModel, ComponentPrintSettings } from 'app/model/model';

@Component({
  selector: 'severity-incident-pie',
  templateUrl: './incident-pie.component.html',
  styleUrls: ['./incident-pie.component.css']
})
export class IncidentPieComponent implements OnInit {

  
  
    chartHeader : string = '';
  
    modelData: SeverityIncidentPieFlipModel;

    setModelData(modelData: SeverityIncidentPieFlipModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }
  
    chartData: PieChartData;

    @Input() componentData: SeverityInput;

    @Input() incidentChartView: string;            

    @Input() printSettings: ComponentPrintSettings;
  
    /**
     * Event handler to indicate the construction of the PieChart's required data is built 
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
      
      constructor(private severityService: SeverityService) {
      }
  
    ngOnInit() {
        this.getSeverityData();
        if(this.printSettings && this.printSettings.drillDown) {
            this.isDrillDownComplete = false;
        }
    }
  
      /**
       * Get Severity Data from back end nodejs server
       */
      getSeverityData() {
          if (this.componentData) {
              this.severityService.getSeverityTypeOfIncidentFlipDetailDataset(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
                  .subscribe(chartData => this.setModelData(chartData));
              }
      }     
  
}
