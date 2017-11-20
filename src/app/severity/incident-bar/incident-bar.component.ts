import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SeverityIncidentBarModel, BarChartData, SeverityInput } from 'app/model/model';
import { SeverityService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
	selector: 'severity-incident-bar',
	templateUrl: './incident-bar.component.html',
	styleUrls: ['./incident-bar.component.css']
})

export class IncidentBarComponent implements OnInit {

	chartHeader: string = '';
	modelData: SeverityIncidentBarModel;

	setModelData(modelData: SeverityIncidentBarModel) {
		this.modelData = modelData;
		this.chartHeader = this.modelData.chartTitle;
	}

	chartData: BarChartData;

	@Input() componentData: SeverityInput;

	/**
	 * Event handler to indicate the construction of the BarChart's required data is built 
	 * @param newChartData BarChart's required data
	 */
	onDataComplete(newChartData: BarChartData) {
		this.chartData = newChartData;
	}

	private chartComponent = new BehaviorSubject<BaseChart>(null);
	chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();

	/**
	 * Event handler to indicate the chart is loaded 
	 * @param chart The chart commponent
	 */
	onChartReDraw(chart: BaseChart) {
		chart.removeRenderedObjects();
		this.addLabelAndImage(chart);
		this.chartComponent.next(chart);
	}

	addLabelAndImage(chart) {
		if (this.modelData.maxValue > 0) {
			if (this.modelData.datasets && this.modelData.datasets.length > 0) {
				if (this.modelData.displayText && this.modelData.displayText.length > 0) {
					let labelHeight = (Math.ceil((this.modelData.displayText.length * 5) / (chart.chart.chartWidth - 85))) * 10;

					chart.addChartLabel(
						this.modelData.displayText,
						10,
						chart.chart.chartHeight - labelHeight,
						'#000000',
						10,
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

			let  yBreakPoint = chart.getYAxisPosition(0);
			chart.addLine([chart.chart.plotLeft - 5, yBreakPoint], [chart.chart.plotLeft + 5, yBreakPoint + 10], '#ccd6eb', 2);
			chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 5], [chart.chart.plotLeft + 5, yBreakPoint + 5], '#FFFFFF', 5.5);
			chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 10], [chart.chart.plotLeft + 5, yBreakPoint], '#ccd6eb', 2);
		}
	}

	constructor(private severityService: SeverityService) {
	}

	ngOnInit() {
		this.getBenchmarkLimitData();
	}

	/**
	 * Get Benchmark Limit Data from back end nodejs server
	 */
	getBenchmarkLimitData() {
		if (this.componentData) {
			this.severityService.getSeverityTypeOfIncidentBarData(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
				.subscribe(modelData => this.setModelData(modelData));

		}
	}

}
