import { Directive, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SeverityIndustryOverviewModel, BarChartData, ComponentPrintSettings } from 'app/model/model';
import { BaseChart } from 'app/shared/charts/base-chart';
import { FormatService } from 'app/services/services';

@Directive({
  selector: '[severity-industry-overview-behavior]'
})
export class SeverityIndustryOverviewDirective implements OnInit, OnChanges {
  
      @Input() modelData: SeverityIndustryOverviewModel;
  
      @Output() onDataComplete = new EventEmitter<BarChartData>();

      @Output() onChartRedraw = new EventEmitter<BaseChart>();
      
      onRedraw(chart: BaseChart) {  
          this.onChartRedraw.emit(chart);
      }
  
      @Input() chartComponent: BaseChart;

      @Input() public printSettings: ComponentPrintSettings;
  
      ngOnChanges(changes: SimpleChanges) {       
          
      }
    
      public static defaultLineColor: string = '#487AA1';
      static maxCharactersPerLine: number = 105;
      seriesColor: string[];
      categories:  any;
  
      displayText: string = '';
  
      constructor(private formatService: FormatService) {
          this.seriesColor = [];     
          this.seriesColor["All Industries"] = '#B1D23B';        
          this.categories =  ['Less than $25M', '$25M to < $100M', '$100M to < $250M', '$250M to < $500M', '$500M to < $1B', '$1B to Greater'];
      }
  
      private getSeriesColor(seriesName: string) {
          return this.seriesColor[seriesName] || SeverityIndustryOverviewDirective.defaultLineColor;
      }
  
      ngOnInit() {
          this.buildHighChartObject();
      }
  
      /**
       * Use chart data from web service to build parts of Highchart chart options object
       */
      buildHighChartObject() {
        if (this.modelData) {

            let legendYOffset: number;
            let marginBottom: number;
            let spacingBottom: number;
            if(this.printSettings) {
                legendYOffset = 20;
                marginBottom = 120;
                spacingBottom = 47;
            } else {
                legendYOffset = 0;
                marginBottom = 137;
                spacingBottom = 45;
            }
            var formatService = this.formatService;
            let tickPosition = this.getTickPosition(this.modelData.maxValue);
            tickPosition.splice(0,0,-0.9, -0.01);
            let tempChartData: BarChartData = {
                series: [],
                title: '',
                subtitle: this.modelData.filterDescription,
                displayText: this.modelData.displayText,
                categories: this.categories,
                xAxisLabel: this.modelData.xAxis,
                yAxisLabel: this.modelData.yAxis,
                xAxisFormatter: null,
                customChartSettings: {    
                  chart: { 
                    marginLeft: this.getMarginLeft(), 
                    marginRight: 25,
                    marginTop: 25,
                    marginBottom: marginBottom,
                    spacingBottom: spacingBottom
                   },                
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: 0,
                            step: 1
                        },
                        title: {
                            style: {                       
                                fontSize: '11px'
                            }
                        },

                        crosshair: false
                    },
                    yAxis: [
                        {
                            tickPositions: tickPosition,
                            type:'logarithmic',
                            gridLineWidth: 0,  
                            tickWidth:0,
                            lineWidth: 0,
                            labels: {
                                format: '{value:,.0f}',
                                formatter: function() {
                                    return formatService.tooltipFormatter(this.value);
                                },
                                style:{
                                    color:'transparent'
                                }
                            },
                            title: false,
                        },
                        {
                            tickPositions: tickPosition,
                            //we can set break point in yaxis based in this value in tickPositions in the yaxis. eg. -0.31 is for 0 and 4 is for 10,000 values
                            type:'logarithmic',
                            breaks: [{
                                from: -0.125,
                                to: 1,
                                breakSize:1
                            }],
                            gridLineWidth: 0,  
                            tickWidth:0,
                            lineWidth: 2,
                            labels: {
                                format: '{value:,.0f}',
                                formatter: function() {
                                    return formatService.tooltipFormatter(this.value.toFixed());
                                }
                            },
                            title: {
                                text: this.modelData.yAxis,
                                style:{
                                    fontSize: '11px'
                                }
                            },
                            offset:-0.125        
                        }
                    ],
                    tooltip: {
                        shared: true,
                        useHTML: true,
                        formatter: function () {
                            let entityMap = {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': '&quot;',
                                "'": '&#39;',
                                "/": '&#x2F;'
                            };
                            let category =  String(this.x).replace(/[&<>"'\/]/g, s => entityMap[s]);
                            let tooltip = '<span style="font-size:11px">' + category + '</span><br>';
                            this.points.forEach(point => {
                                let value = formatService.tooltipFormatter(point.y);
                                tooltip += '<span style="color:' + point.color + '">' + point.series.name + '</span>: <b>' + value + '</b><br/>';
                            }); 

                            return tooltip;
                        }
                    },
                    plotOptions: {
                        column: {
                            pointPadding: 0,
                            borderWidth: 1,
                            borderColor: '#000000',
                            grouping: true
                        }
                    },
                    legend: {
                        enabled: true,
                        symbolHeight: 8,
                        y: legendYOffset
                    }
                },
                hasRedrawActions: true
            }        
              
              let seriesData = new Array();
              let seriesNames = new Array();           
              let series: any; 
              this.displayText = this.modelData.displayText;
  
              this.modelData.datasets.forEach(function (industryOverviewDataset) {
                  if (!seriesData[industryOverviewDataset.description]) {
                    seriesData[industryOverviewDataset.description] = new Array();
                      seriesNames.push(industryOverviewDataset.description);
                  }
                  seriesData[industryOverviewDataset.description].push(industryOverviewDataset.incidentCount);
              });            
                       
              seriesNames.forEach(seriesName => {                   
                  series = new Object();
                  series.data = new Array();
                  series.name = seriesName;
                  series.color = this.getSeriesColor(seriesName);                                  
                  series.data = seriesData[seriesName];                    
                  tempChartData.series.push(series);      
              });  
              this.onDataComplete.emit(tempChartData);
          }
      }

      getTickPosition(maxData: number) {
        let maxLog = Math.ceil(Math.log10(maxData));
        let tickPosition = new Array();

        for (let index = 0; index < maxLog; index++) {
            tickPosition.push(index + 1);
        }

        return tickPosition;
    }

    getMarginLeft() {
        let maxValue = this.modelData.maxValue;
        let maxCharactersLength:number = maxValue.toFixed(0).toString().length + 1;       
        let marginLeft = 60 + (maxCharactersLength * 8);
        
        return marginLeft;
    }
  
  }
  