import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SeverityLossBarModel, BarChartData, SeverityInput, ComponentPrintSettings } from 'app/model/model';
import { SeverityService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
	selector: 'severity-loss-bar',
	templateUrl: './loss-bar.component.html',
	styleUrls: ['./loss-bar.component.css']
})

export class LossBarComponent implements OnInit {

	chartHeader: string = '';
	modelData: SeverityLossBarModel;

	setModelData(modelData: SeverityLossBarModel) {
		this.modelData = modelData;
		this.chartHeader = this.modelData.chartTitle;
	}

	chartData: BarChartData;

	@Input() componentData: SeverityInput;

	@Input() lossChartView: string;    	
	
	@Input() printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
	onDataComplete(newChartData: BarChartData) {
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

	addLabelAndImage(chart) {
        let xPos: number;
        if(this.printSettings == null) {
            xPos = 10;
        } else {
            xPos = 45;
        }
		if (this.modelData.maxValue > 0) {
			if (this.modelData.datasets && this.modelData.datasets.length > 0) {
				if (this.modelData.displayText && this.modelData.displayText.length > 0) {
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

			if(chart.chart.yAxis.length > 0) {
				let  yBreakPoint = chart.getYAxisPosition(0);
				chart.addLine([chart.chart.plotLeft - 5, yBreakPoint], [chart.chart.plotLeft + 5, yBreakPoint + 10], '#ccd6eb', 2);
				chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 5], [chart.chart.plotLeft + 5, yBreakPoint + 5], '#FFFFFF', 5.5);
				chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 10], [chart.chart.plotLeft + 5, yBreakPoint], '#ccd6eb', 2);
			}
		}
	}

	constructor(private severityService: SeverityService) {
	}

	ngOnInit() {
		this.getBenchmarkLimitData();
        if(this.printSettings && this.printSettings.drillDown) {
            this.isDrillDownComplete = false;
		}
	}

    /**
     * Get Benchmark Limit Data from back end nodejs server
     */
	getBenchmarkLimitData() {
		if (this.componentData) {
			this.severityService.getSeverityTypeOfLossBarData(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
				.subscribe(modelData => this.setModelData(modelData));

		}
	}
}