import { Component, Input, OnInit } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { BenchmarkService } from '../../services/services';
import { BenchmarkModel, BenchmarkPremiumDistributionInput } from 'app/model/model';

@Component({
  selector: 'app-premium',
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {

  public static defaultLineColor: string = 'black';

  chartOptions: any;

  seriesColor: string[];

  constructor(private benchmarkService: BenchmarkService) { 
    this.seriesColor = [];
    this.seriesColor["Above Client"] = '#F68C20';
    this.seriesColor["Below Client"] = '#B1D23B';
    this.seriesColor["Client Line"] = '#487AA1';

    this.chartOptions = {
        chart: {
            type: 'column',
            width: 600,
            height: 400
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Placeholder Title'
        },
        subtitle: {
            text: 'Placeholder Sub-Title'
        },
        xAxis: {
            categories: [],
            title: {
                text: 'Range (USD)'
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Program Counts'
            }
        },
        legend: {
            shadow: false
        },
        tooltip: {
            shared: true
        },
        plotOptions: {
            series: {
                marker: { enabled: false },
                events: {
                    legendItemClick: function () {
                        //return false to disable hiding of series when legend item is click
                        return false;
                    }
                }
            },
            column: {
                grouping: false,
                shadow: false,
                borderWidth: 0
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
        series: [
        ],
        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    };

  }

  ngOnInit() {
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
        for(i =  n1 -1; i >= 0; i--) {
            this.chart.series[i].remove();
        }
        //this.chart.xAxis[0].setCategories(this.chartOptions.xAxis.categories);
        // this.chart.title.update({text: this.chartData.chartTitle});
        // this.chart.subtitle.update({text: this.chartData.filterDescription});

        n1 = this.chartOptions.series.length;
        for(i = 0; i < n1; i++) {
            this.chart.addSeries(
                {
                    id: this.chartOptions.series[i].name,
                    name: this.chartOptions.series[i].name,
                    type: 'column',
                    color: this.getSeriesColor(this.chartOptions.series[i].name),
                    data: this.chartOptions.series[i].data
                }
            );
        }
        this.chart.update(this.chartOptions, true);
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || PremiumComponent.defaultLineColor;
    }

    chartData: any;
    public setChartData(data: BenchmarkModel) {
        this.chartData = data;
        var i: number;
        var n1: number;
        var groups = new Array();
        var groupNames = new Array();
        n1 = this.chartData.buckets.length;
        var bucket: any;
        this.chartOptions.xAxis.categories.length = 0;
        for(i = 0; i < n1; i++) {
            bucket = this.chartData.buckets[i];
            this.chartOptions.xAxis.categories.push(bucket.label);
            if(!groups[bucket.group]) {
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
        n2 = this.chartOptions.xAxis.categories.length;
        n1 = groupNames.length;
        for(i = 0; i < n1; i++) {
            group = groups[groupNames[i]];
            series = new Object();
            series.name = groupNames[i];
            series.data = new Array();
            for(j = 0; j < n2; j++) {
                if(group[this.chartOptions.xAxis.categories[j]]) {
                    series.data.push(group[this.chartOptions.xAxis.categories[j]]);
                } else {
                    series.data.push(null);
                }
            }
            this.chartOptions.series.push(series);
        }
        this.chartOptions.title.text = this.chartData.chartTitle;
        this.chartOptions.subtitle.text = this.chartData.filterDescription;
        console.log(this.chartData);
        this.loadChartData();
    }

  @Input() set componentData(data: BenchmarkPremiumDistributionInput) {
      if(data.companyId) {
        this.benchmarkService.getBenchmarkPremiumByCompanyId(data.clientValue, data.chartType, data.companyId)
          .subscribe(chartData => this.setChartData(chartData));
      } else {
        this.benchmarkService.getBenchmarkPremiumByManualInput(data.clientValue, data.chartType, data.naics, data.revenueRange)
          .subscribe(chartData => this.setChartData(chartData));
      }
    }
}
