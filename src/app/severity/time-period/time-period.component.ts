import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { SeverityTimePeriodModel, BarChartData, SeverityInput } from 'app/model/model';
import { SeverityService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
	selector: 'severity-time-period',
	templateUrl: './time-period.component.html',
	styleUrls: ['./time-period.component.css']
})

export class TimePeriodComponent implements OnInit {

	chartHeader: string = '';
	modelData: SeverityTimePeriodModel;

	setModelData(modelData: SeverityTimePeriodModel) {
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
		this.chartComponent.next(chart);
	}

	constructor(private severityService: SeverityService) {
	}

	ngOnInit() {
		this.getSeverityTimePeriodData();
	}

	/**
	 * Get Benchmark Limit Data from back end nodejs server
	 */
	getSeverityTimePeriodData() {
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
