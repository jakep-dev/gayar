import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SeverityTimePeriodModel, BarChartData, SeverityInput, ComponentPrintSettings } from 'app/model/model';
import { SeverityService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
	selector: 'severity-time-period',
	templateUrl: './time-period.component.html',
	styleUrls: ['./time-period.component.css']
})

export class TimePeriodComponent implements OnInit {

	private chartHeader: string = '';

	public modelData: SeverityTimePeriodModel;

	private setModelData(modelData: SeverityTimePeriodModel) {
		this.modelData = modelData;
		this.chartHeader = this.modelData.chartTitle;
	}

	public chartData: BarChartData;

	@Input() public componentData: SeverityInput;

	@Input() public printSettings: ComponentPrintSettings;

	/**
	 * Event handler to indicate the construction of the BarChart's required data is built 
	 * @param newChartData BarChart's required data
	 */
	public onDataComplete(newChartData: BarChartData) {
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
        let xPos: number;
        if(this.printSettings == null) {
			if (this.modelData.maxValue > 0) {
				if(this.modelData.datasets && this.modelData.datasets.length > 0) {
					if(this.modelData.displayText && this.modelData.displayText.length > 0) {
						let labelHeight = (Math.ceil((this.modelData.displayText.length * 5) / (chart.chart.chartWidth - 85))) * 10;
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
				if(chart.chart.yAxis.length > 0) {
					let  yBreakPoint = chart.getYAxisPosition(0);
					chart.addLine([chart.chart.plotLeft - 5, yBreakPoint], [chart.chart.plotLeft + 5, yBreakPoint + 10], '#ccd6eb', 2);
					chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 5], [chart.chart.plotLeft + 5, yBreakPoint + 5], '#FFFFFF', 5.5);
					chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 10], [chart.chart.plotLeft + 5, yBreakPoint], '#ccd6eb', 2);
				}
			}
		}
    }

	constructor(private severityService: SeverityService) {
	}

	ngOnInit() {
		this.getSeverityTimePeriodData();
        if(this.printSettings && this.printSettings.drillDown) {
            this.isDrillDownComplete = false;
		}
	}

	/**
	 * Get Benchmark Limit Data from back end nodejs server
	 */
	private getSeverityTimePeriodData() {
		if (this.componentData) {
			if (this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
				this.severityService.getSeverityTimePeriodData(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
					.subscribe(modelData => this.setModelData(modelData));
			} else {
				this.severityService.getSeverityTimePeriodData(null, this.componentData.naics, this.componentData.revenueRange)
					.subscribe(modelData => this.setModelData(modelData));
			}
		}
	}
}
