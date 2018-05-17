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

    private chartHeader : string = '';
  
    public modelData: SeverityIncidentPieFlipModel;

    private setModelData(modelData: SeverityIncidentPieFlipModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }
  
    public chartData: PieChartData;

    @Input() public componentData: SeverityInput;

    @Input() public incidentChartView: string;            

    @Input() public printSettings: ComponentPrintSettings;
  
    /**
     * Event handler to indicate the construction of the PieChart's required data is built 
     * @param newChartData PieChart's required data
     */
    public onDataComplete(newChartData : PieChartData) {
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
    public onChartReDraw(chart: BaseChart) {
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

    /**
     * get the display text of the underlying chart
     * 
     * @public
     * @function getDisplayText
     * @return {string} - the display string for the underlying chart if available otherwise return null
     */
    public getDisplayText(): string {
        if(this.modelData && this.modelData.displayText && this.modelData.displayText.length > 0) { 
            return this.modelData.displayText;
        } else {
            return null;
        }
    }

    private addLabelAndImage(chart){
        if(this.printSettings == null) {
            if(this.modelData.datasets && this.modelData.datasets.length > 0) {
                if(this.modelData.displayText && this.modelData.displayText.length > 0) {
                    let labelHeight = (Math.ceil((this.modelData.displayText.length * 6) / (chart.chart.chartWidth - 85))) * 12;                    
                    
                    chart.addChartLabel(
                        this.modelData.displayText,
                        10,
                        chart.chart.chartHeight - labelHeight,
                        '#000000',
                        12,
                        null,
                        chart.chart.chartWidth - 85
                    );
                }
            }
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
    private getSeverityData() {
        if (this.componentData) {
        this.severityService.getSeverityTypeOfIncidentFlipDetailDataset(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
            .subscribe(chartData => this.setModelData(chartData));
        }
    }
}
