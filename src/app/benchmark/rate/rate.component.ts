import { Component, OnInit, Input } from '@angular/core';
import { ChartModule } from 'angular2-highcharts';
import { BenchmarkService } from '../../services/services';
import { SearchService } from '../../services/services';
import { ChartUtility } from '../../shared/chart-utility/chart-utility';
import { BenchmarkRateModel, RateQuartile } from 'app/model/model';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {

  public static CHART_UTIL: ChartUtility = new ChartUtility();
  public static CLIENT_LINE: string = "Client Line";

  chart: any;
  chartData: any;
  chartOptions: any;
  quartile: RateQuartile;
  isDataLoaded: boolean;

  constructor(private benchmarkService: BenchmarkService, private searchService: SearchService) {

    console.log('selectedCompany>>>>>>>>>>>>>>>>>>>>', this.searchService.selectedCompany);

    this.isDataLoaded = false;
    this.chartOptions = RateComponent.CHART_UTIL.getCommonChartOptions();
    this.setChartOptions();

  }

  private setChartOptions() {
    this.chartOptions.chart.type = 'boxplot';
    this.chartOptions.plotOptions = {
      boxplot: {
        colorByPoint: false,
        fillColor: '#ffffff',
        color: '#464646',
        medianColor: '#000000',
        medianWidth: 2,
        lineWidth: 2
      }
    };

    this.chartOptions.xAxis = {
      categories: ['1', '2', '3', '4', '5'],
      title: {
        text: '',
        margin: 20
      },
      labels: {
        enabled: false
      }
    };

    this.chartOptions.yAxis = {
      title: {
        text: ''
      },
      min: 0,
      tickInterval: 2500,
      startOnTick: true,
      endOnTick: true,
      plotLines: []
    };

    this.chartOptions.tooltip = {
      enabled: false
    }

    this.chartOptions.series = [{
      pointWidth: 120,
      whiskerLength: '80%',
      name: '',
      data: [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
      ]
    }];
  }

  ngOnInit() {
  }

  public setChart(chart) {
    this.chart = chart;
    console.log('Chart loaded.');

  }

  private loadChartData() {
    this.chart.update(this.chartOptions, true);
    this.addLabels();

  }

  public setChartData(data: BenchmarkRateModel) {
    this.chartData = data;
    this.chartOptions.title.text = this.chartData.chartTitle;
    this.chartOptions.subtitle.text = this.chartData.filterDescription;

    var dataSeries = new Array();
    this.quartile = this.chartData.quartile;

    if (this.quartile) {
      dataSeries.push(this.quartile.minRPM);
      dataSeries.push(this.quartile.firstQuartile);
      dataSeries.push(this.quartile.median);
      dataSeries.push(this.quartile.fourthQuartile);
      dataSeries.push(this.quartile.maxRPM);

      this.chartOptions.series[0].data[2] = dataSeries;

      this.chartOptions.yAxis.plotLines.push({
        color: RateComponent.CHART_UTIL.getSeriesColor('Client Line'),
        value: this.quartile.clientRPMPercentileValue,
        width: '2',
        zIndex: 100
      });
    }

    this.loadChartData();
    this.isDataLoaded = true;
  }

  private addLabels() {

    var ren = this.chart.renderer;
    RateComponent.CHART_UTIL.addChartLabel(
      this.chart,
      '25th% ' + this.quartile.firstQuartile_KMB,
      RateComponent.CHART_UTIL.getXAxisPosition(this.chart, 2.5) - 34,
      RateComponent.CHART_UTIL.getYAxisPosition(this.chart, this.quartile.firstQuartile) + 10,
      null,
      10,
      'bold'
    );

    RateComponent.CHART_UTIL.addChartLabel(
      this.chart,
      'Median ' + this.quartile.median_KMB,
      RateComponent.CHART_UTIL.getXAxisPosition(this.chart, 2) - (('Median ' + this.quartile.median_KMB).length * 7),
      RateComponent.CHART_UTIL.getYAxisPosition(this.chart, this.quartile.median) + 3,
      null,
      10,
      'bold'
    );

    RateComponent.CHART_UTIL.addChartLabel(
      this.chart,
      '75th% ' + this.quartile.fourthQuartile_KMB,
      RateComponent.CHART_UTIL.getXAxisPosition(this.chart, 2.5) - 34,
      RateComponent.CHART_UTIL.getYAxisPosition(this.chart, this.quartile.fourthQuartile) - 5,
      null,
      10,
      'bold'
    );

    RateComponent.CHART_UTIL.addChartLabel(
      this.chart,
      this.quartile.clientRPMPercentile + 'th% ' + this.quartile.clientRPMPercentileValue_KMB,
      RateComponent.CHART_UTIL.getXAxisPosition(this.chart, 0.5),
      RateComponent.CHART_UTIL.getYAxisPosition(this.chart, this.quartile.clientRPMPercentileValue) - 5,
      null,
      10,
      'bold'
    );

    if (this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) {
      RateComponent.CHART_UTIL.addChartLabel(
        this.chart,
        this.searchService.selectedCompany.companyName,
        RateComponent.CHART_UTIL.getXAxisPosition(this.chart, 3.5),
        RateComponent.CHART_UTIL.getYAxisPosition(this.chart, this.quartile.clientRPMPercentileValue) - 5,
        null,
        10,
        'bold'
      );
    }

  }

  @Input() set companyId(companyId: number) {
    if (companyId) {
      this.benchmarkService.getRatePerMillion(companyId)
        .subscribe(chartData => this.setChartData(chartData));
    } else {
      this.benchmarkService.getRatePerMillion(1000637)
        .subscribe(chartData => this.setChartData(chartData));
    }
  }

}
