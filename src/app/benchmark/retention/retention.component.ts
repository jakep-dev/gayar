import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { BenchmarkService } from '../../services/services';
import { ChartUtility } from '../../shared/chart-utility/chart-utility';
import { BenchmarkModel, BenchmarkDistributionInput } from 'app/model/model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.css']
})
export class RetentionComponent implements OnInit {

	public static CHART_UTIL: ChartUtility = new ChartUtility();
	public static CLIENT_LINE: string = "Client Line";

	chart: any;
	chartData: any;
	chartOptions: any;
  isDataLoaded: boolean;

	constructor(private benchmarkService: BenchmarkService) {
    
    this.isDataLoaded = false;
		this.chartOptions = RetentionComponent.CHART_UTIL.getCommonChartOptions();
		this.setChartOptions();
	}

	ngOnInit() {
	}

	@Input() set componentData(data: BenchmarkDistributionInput) {
		if (data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
			this.benchmarkService.getBenchmarkPremiumByCompanyId(data.retentionValue, 'RETENTION', data.companyId)
				.subscribe(chartData => this.setChartData(chartData));
		} else {
			this.benchmarkService.getBenchmarkPremiumByManualInput(data.retentionValue, 'RETENTION', data.naics, data.revenueRange)
				.subscribe(chartData => this.setChartData(chartData));
		}
	}

	private setChartOptions() {
		this.chartOptions.plotOptions = {
			scatter: {
				enableMouseTracking: false,
			},
			series: {
				marker: {
					radius: 8,
				}
			}
		};

		this.chartOptions.xAxis = {
			type: 'category',
			categories: [],
			labels: {
				rotation: -45,
				style: {
					fontSize: '11px',
					fontFamily: 'Verdana, sans-serif',
				}
			},
			title: {
				text: 'Range (USD)',
				style: {
					fontSize: '11px'
				}
			}
		};

		this.chartOptions.yAxis = {
			min: 0,
			title: {
				text: 'Program Counts',
				style: {
					fontSize: '11px'
				}
			}
		};

		this.chartOptions.tooltip = {
			headerFormat: '<b>{point.key}</b><br>',
			pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
		};
	}

	public setChart(chart) {
		this.chart = chart;
	}

	private loadChartData() {
		var i;
		var n1;
		n1 = this.chart.series.length;
		for (i = n1 - 1; i >= 0; i--) {
			this.chart.series[i].remove();
		}

		n1 = this.chartOptions.series.length;
		for (i = 0; i < n1; i++) {
			this.chart.addSeries(
				{
					id: this.chartOptions.series[i].name,
					name: this.chartOptions.series[i].name,
					color: RetentionComponent.CHART_UTIL.getSeriesColor(this.chartOptions.series[i].name),
					data: this.chartOptions.series[i].data,
					type: 'column',
					stack: 'male',
					pointWidth: 20,
					borderWidth: 0,
					pointPlacement: -0.20
				}
			);
		}
		this.chart.update(this.chartOptions, true);

		RetentionComponent.CHART_UTIL.addChartLabel(
			this.chart,
			this.chartData.displayText,
			10,
			this.chart.chartHeight - 10,
			'#000000',
      10,
      null
		);

		RetentionComponent.CHART_UTIL.addChartImage(this.chart, 'https://www.advisen.com/img/advisen-logo.png', this.chart.chartWidth - 80, this.chart.chartHeight - 20, 69, 17);
	}

	public setChartData(data: BenchmarkModel) {
		this.chartData = data;
		var i: number;
		var n1: number;
		var groups = new Array();
		var groupNames = new Array();
		n1 = this.chartData.buckets.length;
		var bucket: any;
		this.chartOptions.xAxis.categories.length = 0;
		for (i = 0; i < n1; i++) {
			bucket = this.chartData.buckets[i];
			this.chartOptions.xAxis.categories.push(bucket.label);
			if (!groups[bucket.group]) {
				groups[bucket.group] = new Array();
				groupNames.push(bucket.group);
			}
			groups[bucket.group][bucket.label] = bucket.count;
		}

		var groupName: string;
		var group: any;
		var j: number;
		var n2: number;
		var series;
		var clientCategoryLabel: any;
		clientCategoryLabel = new Object({ value: '' });

		n2 = this.chartOptions.xAxis.categories.length;
		n1 = groupNames.length;
		for (i = 0; i < n1; i++) {
			group = groups[groupNames[i]];
			series = new Object();
			series.name = groupNames[i];
			series.data = new Array();
			for (j = 0; j < n2; j++) {
				if (group[this.chartOptions.xAxis.categories[j]]) {
					if (series.name === RetentionComponent.CLIENT_LINE) {
						clientCategoryLabel.value = this.chartOptions.xAxis.categories[j];
					}
					series.data.push(group[this.chartOptions.xAxis.categories[j]]);
				} else {
					series.data.push(null);
				}
			}
			this.chartOptions.series.push(series);
		}
		this.chartOptions.title.text = this.chartData.chartTitle;
		this.chartOptions.subtitle.text = this.chartData.filterDescription;
		this.chartOptions.xAxis.title.text = this.chartData.xAxis;
		this.chartOptions.yAxis.title.text = this.chartData.yAxis;

		if (clientCategoryLabel.value) {
			this.chartOptions.xAxis.labels.formatter =
				function () {
					if (clientCategoryLabel.value === this.value) {
						return '<span style="fill: #487AA1;font-size:11px;font-weight:bold;">' + this.value + '</span>';
					} else {
						return this.value;
					}
				}
		}

    this.loadChartData();
    this.isDataLoaded = true;
	}
}

