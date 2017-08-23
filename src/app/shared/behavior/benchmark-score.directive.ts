import { Directive, Output, Input, EventEmitter } from '@angular/core';
import { BenchmarkScoreModel, GaugeChartData } from 'app/model/model';
import { BaseChartComponent } from '../charts/base-chart/base-chart.component';

@Directive({
  selector: '[benchmark-score]'
})
export class BenchmarkScoreDirective {


  @Input('modelData') set setChartData(data: BenchmarkScoreModel) {
    if (data) {

      let tempChartData: GaugeChartData = {
        score: data.score.finalScore,
        categories: [],
        series: [{
          data: data.score
        }
        ],
        subtitle: '',
        title: data.chartTitle,
        displayText: data.displayText,
        xAxisFormatter: null,
        xAxisLabel: '',
        yAxisLabel: '',
        customChartSettings: {
          chart: {
            type: 'solidgauge',
            marginLeft: 30
          },
          title: null,
          pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
              backgroundColor: '#EEE',
              innerRadius: '60%',
              outerRadius: '100%',
              shape: 'arc'
            }
          },

          tooltip: {
            enabled: false
          },

          // the value axis
          yAxis: {
            stops: [
              [0.1, '#55BF3B'], // green
              [0.5, '#DDDF0D'], // yellow
              [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            tickAmount: 2,
            title: {
              y: 70,
              text: null
            },
            labels: {
              y: 16
            },
            min: 0,
            max: 100
          },

          plotOptions: {
            solidgauge: {
              dataLabels: {
                y: 5,
                borderWidth: 0,
                useHTML: true
              }
            }
          },

          credits: {
            enabled: false
          },

          series: [{
            name: '',
            data: [data.score.finalScore],
            dataLabels: {
              format: null
            },
            tooltip: {
              valueSuffix: null
            }
          }]
        }, 
        hasRedrawActions: true,
      }


      this.displayText = data.displayText;
      this.onDataComplete.emit(tempChartData);
    }

  }

  @Output() onDataComplete = new EventEmitter<GaugeChartData>();

  @Input('chartObject') set setChartObject(chartObject: any) {
    if (chartObject && chartObject.isObjectValid) {
      let chart = chartObject.highChartObject;
      BaseChartComponent.addChartLabel(
        chart,
        this.displayText,
        10,
        chart.chartHeight - 30,
        '#000000',
        10,
        null,
        500
      );
      BaseChartComponent.addChartImage(
        chart,
        'https://www.advisen.com/img/advisen-logo.png',
        chart.chartWidth - 80,
        chart.chartHeight - 20,
        69,
        17
      );
      chartObject.isObjectValid = false;
    }
  }

  public static defaultLineColor: string = 'black';

  static CLIENT_LINE: string = "Client Line";

  seriesColor: string[];

  displayText: string = '';

  constructor() {

    this.seriesColor = [];
    this.seriesColor["Above Client"] = '#F68C20';
    this.seriesColor["Below Client"] = '#B1D23B';
    this.seriesColor[BenchmarkScoreDirective.CLIENT_LINE] = '#487AA1';
  }

  private getSeriesColor(seriesName: string) {
    return this.seriesColor[seriesName] || BenchmarkScoreDirective.defaultLineColor;
  }

  ngOnInit() { }

}
