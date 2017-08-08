import { Component, OnInit, Input } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { BenchmarkService } from '../../services/services';
import { BenchmarkModel, LimitAdequacyChart } from 'app/model/model';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'app-peer-group-loss',
	templateUrl: './peer-group-loss.component.html',
	styleUrls: ['./peer-group-loss.component.css']
})
export class PeerGroupLossComponent implements OnInit {

	public static defaultLineColor: string = 'black';

	chartOptions: any;

   ngOnInit() {}
	constructor(private benchmarkService: BenchmarkService) {

		this.chartOptions = {
			chart: {
				type: 'column',
				height: 370,
        width: 600,
				spacingBottom: 40,
				spacingRight: 20,
				spacingLeft: 20
				
			},
			credits: {
				enabled: true,
				text:'<span style="color:transparent;font-size:12px;">placeholder</span>',
				href: 'javascript:window.open("https://www.advisenltd.com", "_blank")'
			},
			title: {
				text: 'Placeholder Title',
				style: {
					font: 'bold 14px "Trebuchet MS", Verdana, sans-serif'
				}
			},
			subtitle: {
				text: '',
				labels: {
					enabled: false
				}
			}, 	
			xAxis: {
				type: 'category',
            	categories: [],
				labels: {
					enabled: false
				},
				title: {
					text: 'Peer Group Losses',
					lign: 'center',
					verticalAlign: 'bottom',
					margin: 15,
					floating: true,
					style: {
						fontSize: '11px',
						padding: '5px'
					}
				},
				subtitle: {
					text: 'Custom with <b>simple</b> <i>markup</i>'
				}
			},
			yAxis: {
				allowDecimals: false,
				min: 0,
				max: 250000000,
				tickInterval: 50000000,
				title: {
					text: 'Loss Amount (USD)',
					style: {
						fontSize: '11px'
					}
				},
				plotLines: [
					{
						color: '#000000',
						value: '', // For Median Peer Program Limit
						width: '2',
						zIndex: 5 
					},
					{
						color: '#487AA1',
						width: '2',
						zIndex: 5,
						value: '' // For Client Limit
					}]
			},
			legend: {
				shadow: false,
				margin: 10,
			},
			tooltip: {
				formatter: function () {
					return '<b>' + this.x + '</b><br/>' +
						this.series.name + '<br/>';
				}
			},
			plotOptions: {
				column: {
					stacking: 'normal'
				},
				series: {
					pointPadding: 0.0125,
					shadow: false
				},
				groupPadding: 0,
				line: {
					dataGrouping: {
						enabled: false
					}
				}
			},
			lang: {
				noData: "No Data Available"
			},
			noData: {
				style: {
					fontWeight: 'bold',
					fontSize: '15px',
					color: '#FF0000'
				}
			},
			series: [{
				name: 'Loss Amount - Above Client Limit',
				showInLegend: false,
				color: '#F68C20',
				stack: 'male',
				data: []
			}, {
				name: 'Loss Amount - Below Client Limit',
				showInLegend: false,
				color: '#B1D23B',
				stack: 'male',
				data: []
			}, {
				name: 'Loss Amount - Above Client Limit',
				type: 'line',
				color: '#F68C20',
				marker: {
					symbol: 'circle'
				},
				marginBottom: 30
			}, {
				name: 'Loss Amount - Below Client Limit',
				type: 'line',
				color: '#B1D23B',
				marker: {
					symbol: 'circle'
				},
				marginBottom: 30
			}, {
				name: 'Client Limit',
				type: 'line',
				color: '#487AA1',
				marker: {
					symbol: 'circle'
				},
				marginBottom: 30
			}, {
				name: 'Median Peer Program Limit',
				type: 'line',
				color: '#000000',
				marker: {
					symbol: 'circle'
				},
				marginBottom: 30
			}],
			navigation: {
				buttonOptions: {
					enabled: false
				}
			}
		}
   }
   
	chart: any;
	public setChart(chart) {
		this.chart = chart;
		console.log('Chart loaded.');
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
					type: 'column',
					data: this.chartOptions.series[i].data
				}
			);
		}
		this.chart.update(this.chartOptions, true);
	}

	chartData: any;
	public setChartData(data: BenchmarkModel) {
		this.chartData = data;
		var i: number;
    var series;
    
		for (i = 0; i < this.chartData.losses.length; i++) {
			this.chartOptions.series[0].data.push(this.chartData.losses[i].lossAboveLimit);
			this.chartOptions.series[1].data.push(this.chartData.losses[i].lossBelowLimit);
		}

		this.chartOptions.title.text = this.chartData.chartTitle;
		this.chartOptions.yAxis.plotLines[0].value = this.chartData.medianLimit;
		this.chartOptions.yAxis.plotLines[1].value = this.chartData.clientLimit;
		
		this.loadChartData();
		this.renderLabel(this.chart);
	}

	private renderLabel(chart: any) {
	
		//render legend text
		chart.renderer.text('Losses for the recent 10 years, based on the Filling or Accident Date and Total Amount.', 65, 335)
			.css({
				color: '#000000',
				fontSize: '11px'
			})
			.add();
		
		//render chart text
		chart.renderer.text('This chart illustrates your client\'s peer group median limit compared to losses that similar companies have experienced.', 25, 355)
			.css({
				width: 500,
                height: 110,
				color: '#000000',
				fontSize: '9px'
			})
			.add();
		
		//render advisen image
      chart.renderer.image('https://www.advisen.com/img/advisen-logo.png', 510, 345, 69, 17)
      .css({
         cursor: 'pointer'
	  }).add();
	}

	@Input() set componentData(data: LimitAdequacyChart) {
		if (data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
			this.benchmarkService.getLimitAdequacy(data.companyId, data.limits)
				.subscribe(chartData => this.setChartData(chartData));
		}else{
			this.benchmarkService.getLimitAdequacyChartByManualInput(data.limits, data.naics , data.revenue_range)
				.subscribe(chartData => this.setChartData(chartData));
		}
	}
}
