import { Directive, SimpleChanges, Input, Output, EventEmitter } from '@angular/core';
import { PieChartData, FrequencyLossPieFlipModel } from 'app/model/model';
import { BaseChart } from 'app/shared/charts/base-chart';

@Directive({
  selector: '[frequency-loss-pie]'
})
export class FrequencyLossPieDirective {

  
  @Input() modelData: FrequencyLossPieFlipModel;

  @Output() onDataComplete = new EventEmitter<PieChartData>();

  @Input() chartComponent: BaseChart;

  

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartComponent'] && changes['chartComponent'].currentValue) {
      this.chartComponent = changes['chartComponent'].currentValue;
      if(this.modelData.datasets && this.modelData.datasets.length > 0) {
        if(this.displayText && this.displayText.length > 0) {
            let labelHeight = (Math.ceil((this.displayText.length * 5) / (this.chartComponent.chart.chartWidth - 85))) * 10;
            
            this.chartComponent.addChartLabel(
                this.displayText,
                10,
                this.chartComponent.chart.chartHeight - labelHeight,
                '#000000',
                10,
                null,
                this.chartComponent.chart.chartWidth - 85
            );
        }
        
        this.chartComponent.addChartImage(
            'https://www.advisen.com/img/advisen-logo.png',
            this.chartComponent.chart.chartWidth - 80,
            this.chartComponent.chart.chartHeight - 20,
            69,
            17
        );
      }
    }
  }

  public static defaultLineColor: string = 'black';
  public static BLUE: string = '#487AA1';
  public static GREEN: string = '#B1D23B';
  public static CYAN: string = '#27A9BC';
  public static ORANGE: string = '#F68C20';
  public static DGRAY: string = '#464646';
  public static LGRAY: string = '#CCCCCC';

  displayText: string = '';

  constructor() {}

  ngOnInit() {
    this.setDataInDescendingOrder();
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
        onDrillDown: null,
        drilldownUpText: this.setDrilldownUpText(),
        customChartSettings: {
          chart: {
            type: 'pie',
            marginLeft: -170,
            marginBottom: 50
          },
          colors:[
            FrequencyLossPieDirective.BLUE , //'#487AA1'
            FrequencyLossPieDirective.GREEN, //'#B1D23B'
            FrequencyLossPieDirective.CYAN, //'#27A9BC'
            FrequencyLossPieDirective.ORANGE, //'#F68C20'
            FrequencyLossPieDirective.DGRAY, //'#464646'
            FrequencyLossPieDirective.LGRAY, //'#CCCCCC'
          ],
          legend: {
            align: 'left',
            verticalAlign: 'top',
            layout: 'vertical',
            x: 400,
            y: 100,
            itemStyle: {
                cursor: 'default',
            },
            labelFormatter: function(){
              var seriesName = this.name;
              var wrapSeriesName = "";
              var lastAppended = 0;
              var lastSpace = -1;
              for (var i = 0; i < seriesName.length; i++) {
                  if (seriesName.charAt(i) == ' ') lastSpace = i;
                  if (i - lastAppended > 20) {
                      if (lastSpace == -1) lastSpace = i;
                      wrapSeriesName += seriesName.substring(lastAppended, lastSpace);
                      lastAppended = lastSpace;
                      lastSpace = -1;
                      wrapSeriesName += "<br>";
                  }
              }
              wrapSeriesName += seriesName.substring(lastAppended, seriesName.length);
              return wrapSeriesName;
            }
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: '{point.y:.1f}%',
                style:{
                    textOutline: false,
                },
                events:{
                  click: function(){
                    return false;
                  }
                }
              },
              states: {
                hover:{
                  enabled: false
                }
              }
            },
            pie: {
              allowPointSelect: false,
              dataLabels: {
                enabled: true,
                distance: -30,
                color: '#003399'
              },
              point: {
                  events: {
                      legendItemClick: function () {
                          return false;
                      }
                  }
              },
              showInLegend: true,
              borderColor: '#CCCCCC',
              size: '95%'
            }
          },
          tooltip: {  
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b> of total<br/>'
          },
          drilldown:{
            activeAxisLabelStyle: {
              textDecoration: 'none',
              color: '#003399'
            },
            activeDataLabelStyle: {
              textDecoration: 'none',
              color: '#003399',
            },
            drillUpButton: {
              relativeTo: 'spacingBox',
              height: 10,
              position: {
                y: 50,
                x: 0
              },
              theme: {
                  fill: 'white',
                  'stroke-width': 1,
                  stroke: 'silver',
                  r: 0,
                  display: 'hidden',
                  states: {
                      hover: {
                          fill: '#F68C20'
                      },
                      select: {
                          stroke: '#487AA1',
                          fill: '#F68C20'
                      }
                  }
              }
            },
            series:[]
          }
        },
        hasRedrawActions: true,
      }
      
      this.displayText = this.modelData.displayText;

      let datasets: any;
      let dataDrilldownSeries: any;
      let series: any;
      let seriesIndex: number;
      let seriesLength: number;
      let nameType = new Array();
      let groupNameType = new Array();
      let groups = new Array();
      let sortSeriesInDescOrder= new Array();
      
      if(this.modelData.datasets && this.modelData.datasets.length > 0){
        
        seriesLength = this.modelData.datasets.length;

        for(seriesIndex = 0; seriesIndex < seriesLength; seriesIndex++){
          datasets = this.modelData.datasets[seriesIndex];
          if(!nameType[datasets.type]){
            nameType[datasets.type] = new Array();
            groupNameType.push(datasets.type);
          }
        }
      }

      // Get Series Data
      groupNameType = groupNameType.reverse();
      series = new Object();
      series.name =  'Peer Group Information';
      series.colorByPoint = true;
      series.startAngle = -90;
      series.data = new Array();

      groupNameType.forEach(name => {

        groups = this.modelData.datasets.filter(
          perGroup => perGroup.type === name && perGroup.sub_type === null && perGroup.pct_count !== null
        );
        
        if(groups && groups.length > 0){
          groups.map(item => {
            return {  
              name: item.type,
              y: item.pct_count,
              drilldown: item.type,
              dataLabels: this.setDataLabelsDistance(groupNameType, item.pct_count)
            }
          }).forEach(item => series.data.push(item));
        }
      });
      sortSeriesInDescOrder.push(series);

      sortSeriesInDescOrder.forEach(function(item){
        item.data.sort(function(a,b){
          if(a.y < b.y){
            return 1;
          }else if (a.y > b.y){
            return -1;
          }
          return 0;
        });
      });
      tempChartData.series = sortSeriesInDescOrder;

      // Start Get Drilldown Data
      groupNameType.forEach(name => {
        dataDrilldownSeries = new Object();
        dataDrilldownSeries.data = new Array();

        let drilldownGroup = this.modelData.datasets.filter(eachGroup => eachGroup.type === name &&
                              eachGroup.sub_type !== null && eachGroup.pct_count !== null);

        if(drilldownGroup && drilldownGroup.length>0){
            dataDrilldownSeries.name = name;
            dataDrilldownSeries.id = name;
            dataDrilldownSeries.data= drilldownGroup.map(group=> {
                return{
                  name: group.sub_type,
                  y: group.pct_count,
                  dataLabels: this.setDataLabelsDistance(groupNameType, group.pct_count)
                }
            });
          tempChartData.customChartSettings.drilldown.series.push(dataDrilldownSeries);
        }
      });

      //Drilldown behavior
      tempChartData.onDrillDown = function(event, chart){
        var e = event.originalEvent;
        var drilldowns = this.chartData.customChartSettings.drilldown.series;
        e.preventDefault();
        drilldowns.forEach(function (p, i) {
            if (p.id.includes(e.point.name) ) {
                chart.addSingleSeriesAsDrilldown(e.point, p);
            }
        }); 
        chart.applyDrilldown();
      };

      this.onDataComplete.emit(tempChartData);
    }
  }

  setDataInDescendingOrder(){
    this.modelData.datasets.sort(function(a,b){
      if(a.pct_count < b.pct_count){
            return 1;
      }else if (a.pct_count > b.pct_count){
        return -1;
      }
      return 0;
    });
  }

  setDataLabelsDistance(groupNameType, pct_count){
    if(groupNameType && groupNameType.length >= 2){
      var dataLabels = {
          distance: (pct_count < 5) ? 10: -30
      }
    }
    return  dataLabels;
  }

  setDrilldownUpText(){
    return '< <span style="font-size:9px"> Back to all Types<br/>' +
           '<span style="font-size:9px"> of Losses</span>';
  }

}
