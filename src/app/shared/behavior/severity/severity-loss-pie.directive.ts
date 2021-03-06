import { Directive, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { BaseChart } from 'app/shared/charts/base-chart';
import { PieChartData, SeverityLossPieFlipModel } from 'app/model/model';
import { SessionService, SeverityService } from 'app/services/services';

@Directive({
  selector: '[severity-loss-pie]'
})
export class SeverityLossPieDirective {

  @Input() modelData: SeverityLossPieFlipModel;
  
    @Output() onDataComplete = new EventEmitter<PieChartData>();
  
    @Input() chartComponent: BaseChart;
  
    @Input() chartView: string;    
  
    ngOnChanges(changes: SimpleChanges) {
      if(changes &&
        changes.chartView &&
        !changes.chartView.firstChange) {
    
        let currentView = changes.chartView.currentValue;
        let chart = this.chartComponent.chart;
        let findCategory : any;
  
        if(currentView === 'main' &&
            chart.drilldownLevels.length > 0) {
            chart.drillUp();
        }else if(currentView !== 'main' &&
            !chart.options.chart.drilled){
          if(chart.series[0].data){
              findCategory = chart.series[0].data.find(data => {
                if(data && data.name === currentView) {
                    return data;
                }
              });
  
              if(findCategory){
                findCategory.doDrilldown();
              }
          }
          else{
            chart.drillUp();
          }
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
    hasDetailAccess: boolean;
  
    constructor(private sessionService: SessionService, private severityService: SeverityService) {}
  
    ngOnInit() {
      this.setDataInDescendingOrder();
      this.getDetailAccess();
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
              marginLeft: -60,
              marginRight: 100,
              marginBottom: 50
            },
            colors:[
              SeverityLossPieDirective.BLUE , //'#487AA1'
              SeverityLossPieDirective.GREEN, //'#B1D23B'
              SeverityLossPieDirective.CYAN, //'#27A9BC'
              SeverityLossPieDirective.ORANGE, //'#F68C20'
              SeverityLossPieDirective.DGRAY, //'#464646'
              SeverityLossPieDirective.LGRAY, //'#CCCCCC'
            ],
            legend: {
              align: 'right',
              verticalAlign: 'top',
              layout: 'vertical',
              y: 50,
              padding: 50,
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
                  formatter : function(){
                    let value = this.point.y.toString(); 
                    if(this.point && this.point.y){
                      value = Number(this.point.y).toFixed(8).replace(/\.?0+$/,"");
                      if(value.indexOf('.') > -1) { 
                        return value.substring(0, value.indexOf('.') + 2 ) + '%'; 
                      } else { 
                        return value + '%'; 
                      } 
                    }
                  },
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
                borderColor: '#CCCCCC',
                size: '95%'
              }
            },
            tooltip: {  
              useHTML: true,
              headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
              formatter: function(){
                if(this.point && this.point.y){
                  var e = Number(this.point.y).toFixed(8).replace(/\.?0+$/,"");
                  return '<span style="color:{point.color}">'+this.point.name+'</span>: <b>'+e+'%</b><br/>'
                }
              }
            },
            drilldown:{
              activeAxisLabelStyle: {
                textDecoration: 'none',
                color: '#000000'
              },
              activeDataLabelStyle: {
                textDecoration: 'none',
                color: '#000000',
              },
              drillUpButton: {
                relativeTo: 'spacingBox',
                height: 10,
                position: {
                  y: 20,
                  x: 0
                },
                theme: {
                   height: 27,
                   width: 87,
                    fill: 'white',
                    'stroke-width': 1,
                    stroke: 'silver',
                    r: 0,
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
                        && perGroup.pct_count !== 0
          );
          
          if(groups && groups.length > 0){
            groups.map(item => {
              return {  
                name: item.type,
                y: item.pct_count,
                drilldown: (!this.hasDetailAccess) ? null : item.type,
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
                                eachGroup.sub_type !== null && eachGroup.pct_count !== null &&
                                eachGroup.pct_count !== 0);
  
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
        
        var severityService = this.severityService;

        //Drilldown behavior
        tempChartData.onDrillDown = function(event, chart){
          var e = event.originalEvent;
          var drilldowns = this.chartData.customChartSettings.drilldown.series;
          severityService.setLossChartView(e.point.name);
          e.preventDefault();
          drilldowns.forEach(function (p, i) {
              if (p.id.includes(e.point.name) ) {
                  chart.addSingleSeriesAsDrilldown(e.point, p);
              }
          }); 
          chart.applyDrilldown();
        };

        tempChartData.onDrillUp = function (event, chart) {
          severityService.setLossChartView('main');
        }
  
        this.onDataComplete.emit(tempChartData);
      }
    }
  
    getDetailAccess() {
      let permission = this.sessionService.getUserPermission();
      this.hasDetailAccess = permission && permission.severity && permission.severity.loss && permission.severity.loss.hasDetailAccess;
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
            distance: (pct_count < 5) ? 20: -30
        }
      }
      return  dataLabels;
    }
  
    setDrilldownUpText(){
      return '<span style="font-size:9px">  Back to All Types </span><br/>' +
              '<span style="font-size:9px"> of Losses</span>';
    }
  

}
