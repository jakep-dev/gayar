import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { BaseChart } from './../../charts/base-chart';
import { FrequencyIncidentPieFlipModel, PieChartData } from 'app/model/model';

@Directive({
  selector: '[frequency-incident-pie]'
})
export class FrequencyIncidentPieDirective {

  
  @Input() modelData: FrequencyIncidentPieFlipModel;

  @Output() onDataComplete = new EventEmitter<PieChartData>();

  @Input() chartComponent: BaseChart;

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartComponent'] && changes['chartComponent'].currentValue) {
      this.chartComponent = changes['chartComponent'].currentValue;
      this.chartComponent.addChartLabel(
        this.displayText,
        10,
        this.chartComponent.chart.chartHeight - 30,
        '#000000',
        10,
        null,
        500
      );
      this.chartComponent.addChartImage(
        'https://www.advisen.com/img/advisen-logo.png',
        this.chartComponent.chart.chartWidth - 80,
        this.chartComponent.chart.chartHeight - 20,
        69,
        17
      );
    }
  }

  public static defaultLineColor: string = 'black';
  public static BLUE: string = '#487AA1';
  public static GREEN: string = '#B1D23B';
  public static CYAN: string = '#27A9BC';
  public static ORANGE: string = '#F68C20';
  public static DGRAY: string = '#464646';
  public static LGRAY: string = '#CCCCCC';

  seriesColor: any[];

  displayText: string = '';

  constructor() {}

  ngOnInit() {
    this.buildHighChartObject();
  }

  /**
   * Use chart data from web service to build parts of Highchart chart options object
   */
  buildHighChartObject() {
    if (this.modelData) {
      let tempChartData: PieChartData = {
        series: [],
        categories: [],
        subtitle: this.modelData.filterDescription,
        title: '',
        displayText: this.modelData.displayText,
        xAxisFormatter: null,
        xAxisLabel: '',
        yAxisLabel: '',
        drilldownUpText:'<span style="font-size:9px">  Back to All Types </span><br/>' +
                              '<span style="font-size:9px"> of Incidents</span>',
        customChartSettings: {
          chart: {
            type: 'pie',
            marginLeft: -250,
            marginBottom: 50
          },
          legend: {
            align: 'right',
            verticalAlign: 'top',
            layout: 'vertical',
            x: -30,
            y: 100,
            itemStyle: {
                cursor: 'default'
            }
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%',
                style: {
                  textOutline: false,
                }
              }
            },
            pie: {
              allowPointSelect: false,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                distance: -30,
                color: '#000000'
              },
              point: {
                  events: {
                      legendItemClick: function () {
                          return false;
                      }
                  }
              },
              showInLegend: true,
              borderColor: '#CCCCCC'
            }
          },
          tooltip: {  
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
          },
          drilldown:{
            drillUpButton: {
              relativeTo: 'spacingBox',
              height: 10,
              position: {
                y: 50,
                x: 0
              }
            },
            series:[]
          }
        },
        hasRedrawActions: true,
      }
      
      this.displayText = this.modelData.displayText;
      this.buildSeriesColor();

      let datasets: any;
      let nameType = new Array();
      let groupNameType = new Array();
      let seriesIndex: number;
      let seriesLength: number;
      let groups = new Array();
      let tempSeries : any;
      let tempDrilldownSeries : any;
      let dataDrilldownSeries: any;
      let series: any;

      seriesLength = this.modelData.datasets.length;
      
      if(this.modelData.datasets && this.modelData.datasets.length > 0){

        for(seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++){
          datasets = this.modelData.datasets[seriesIndex];
          if(!nameType[datasets.type]){
            nameType[datasets.type] = new Array();
            groupNameType.push(datasets.type);
          }
        }
      }

      // Series Data
      groupNameType = groupNameType.reverse();
      series = new Object();
      series.name =  'Peer Group Information';
      series.colorByPoint = true;
      series.startAngle = -90;
      series.data = new Array();

      groupNameType.forEach((name, index) => {
        groups = this.modelData.datasets.filter(
          perGroup => perGroup.type === name && perGroup.sub_type === null
        );
        if(groups && groups.length > 0){
          groups.map(item => {
            return {  
              name: item.type,
              y: item.pct_count,
              drilldown: item.type,
              color: this.getSeriesColor(index)
            }
          }).forEach(item => series.data.push(item));
        }
      });
      tempChartData.series.push(series);
      // End Series Data

      // Start Drilldown Data
      tempDrilldownSeries = new Array();
      let start_index : number;
      groupNameType.forEach(name => {
        dataDrilldownSeries = new Object();
        dataDrilldownSeries.data = new Array();
        start_index = 0;
        this.modelData.datasets.forEach(datasets => {
          if(name === datasets.type && datasets.sub_type !== null){
            dataDrilldownSeries.name = name;
            dataDrilldownSeries.id = datasets.type;
            dataDrilldownSeries.data.push({
              name: datasets.sub_type,
              y: datasets.pct_count,
              color: this.getSeriesColor(start_index)
            });
            start_index++;
          }
        });
        tempChartData.customChartSettings.drilldown.series.push(dataDrilldownSeries);
      });
      // End Drilldown Data

      this.onDataComplete.emit(tempChartData);
    }
  }

  buildSeriesColor(){
    this.seriesColor = [];
    this.seriesColor[0] = FrequencyIncidentPieDirective.BLUE ; //'#487AA1'
    this.seriesColor[1] = FrequencyIncidentPieDirective.GREEN; //'#B1D23B'
    this.seriesColor[2] = FrequencyIncidentPieDirective.CYAN; //'#27A9BC'
    this.seriesColor[3] = FrequencyIncidentPieDirective.ORANGE; //'#F68C20'
    this.seriesColor[4] = FrequencyIncidentPieDirective.DGRAY; //'#464646'
    this.seriesColor[5] = FrequencyIncidentPieDirective.LGRAY; //'#CCCCCC'
  }

  private getSeriesColor(index: any) {
        return this.seriesColor[index] || FrequencyIncidentPieDirective.defaultLineColor;
    }



}
