import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkModel, BarChartData, BenchmarkDistributionInput, ComponentPrintSettings } from 'app/model/model';
import { BenchmarkService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.scss']
})
export class RetentionComponent implements OnInit {

    private chartHeader:string = '';

    public modelData: BenchmarkModel;

    private setModelData(modelData: BenchmarkModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    public chartData: BarChartData;

    @Input() public componentData: BenchmarkDistributionInput;

    @Input() public printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
    public onDataComplete(newChartData : BarChartData) {
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
    public onChartReDraw(chart: BaseChart) {
        chart.removeRenderedObjects();
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
        if(!this.isFirstRedrawComplete.getValue()) {
            this.isFirstRedrawComplete.next(true);
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

    private addLabelAndImage(chart: BaseChart){
        if(this.printSettings == null) {
            let labelHeight = (Math.ceil((chart.chartData.displayText.length * 6) / (chart.chart.chartWidth - 85))) * 12;           
            chart.addChartLabel(
                chart.chartData.displayText,
                10,
                chart.chart.chartHeight - labelHeight,
                '#000000',
                12,
                null,
                chart.chart.chartWidth - 85
            );
            chart.addChartImage(
                '../assets/images/advisen-logo.png',
                chart.chart.chartWidth - 80,
                chart.chart.chartHeight - 20,
                69,
                17
            );
        }
    }
    
    constructor(private benchmarkService: BenchmarkService) {
    }

    ngOnInit() {
        this.getBenchmarkRetentionData();
    }

    /**
     * Get Benchmark Retention Data from back end nodejs server
     */
    private getBenchmarkRetentionData() {
        if(this.componentData) {
            if(this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getBenchmarkPremiumByCompanyId(this.componentData.retentionValue, 'RETENTION', this.componentData.companyId)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getBenchmarkPremiumByManualInput(this.componentData.retentionValue, 'RETENTION', this.componentData.naics, this.componentData.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }
        }
    }
}
