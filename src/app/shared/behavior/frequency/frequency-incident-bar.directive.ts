import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FrequencyIncidentBarModel, FrequencyIncidentGroup, ComponentPrintSettings } from "app/model/model";
import { SearchService, SessionService , FrequencyService, FormatService} from 'app/services/services';

@Directive({
    selector: '[frequeny-bar-incident]'
})
export class FrequencyIncidentBarDirective {

    @Input() modelData: FrequencyIncidentBarModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    @Input() chartView: string;
  
    @Input() public printSettings: ComponentPrintSettings;

      ngOnChanges(changes: SimpleChanges) {   
          if(changes &&
              changes.chartView &&
              !changes.chartView.firstChange) {
                let currentView = changes.chartView.currentValue;  
                let chart : any;
                let findCategory : any;            
                chart = this.chartComponent.chart;              
              if( currentView !== 'main'){ 
                  if(chart.series[0].data){
                      findCategory = chart.series[0].data.find(data => {                                              
                      if(data && data.name === currentView) { 
                          return data; 
                      } 
                      }); 
                      if( findCategory){                 
                          findCategory.doDrilldown();            
                      }      
                  } 
              }else if(currentView === 'main' &&  chart.drilldownLevels.length > 0) {          
                  chart.drillUp(); 
              }  
          }
        }
  
    public static defaultLineColor: string = 'black';
    hasDetailAccess: boolean;
    seriesColor: string[];
    displayText: string = '';
    companyName: string = '';

    constructor(private searchService: SearchService, private sessionService: SessionService, private frequencyService: FrequencyService, private formatService: FormatService) {        
        this.seriesColor = [];
        this.seriesColor["Company"] = '#F68C20';
        this.seriesColor["Peer"] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || FrequencyIncidentBarDirective.defaultLineColor;
    }

    ngOnInit() {        
        this.getCompanyName();
        this.getDetailAccess();
        this.buildHighChartObject();
    }

    getCompanyName() {
        if (this.searchService.selectedCompany && this.searchService.selectedCompany.companyName) {
            this.companyName = this.searchService.selectedCompany.companyName;
        } else if (this.searchService.searchCriteria && this.searchService.searchCriteria.value) {
            this.companyName = this.searchService.searchCriteria.value;
        }
    }

    getDetailAccess() {
        let permission = this.sessionService.getUserPermission();
        this.hasDetailAccess = permission && permission.frequency && permission.frequency.incident && permission.frequency.incident.hasDetailAccess;
    }

    getSeriesObject(groupName) {
        switch (groupName) {
            case 'Peer':
                return {
                    name: 'Peer Group',
                    id: '',
                    type: 'column',
                    color: this.seriesColor[groupName],
                    data: []
                }
            case 'Company':
                return {
                    name: this.companyName,
                    id: '',
                    type: 'scatter',
                    pointPadding: 0.2,
                    color: this.seriesColor[groupName],
                    marker: {
                        symbol: 'circle',
                    },
                    data: []
                }
            default: break;
        }
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        this.buildNoBreakChart();
    }

    buildNoBreakChart() {

        let legendYOffset: number;
        let marginBottom: number;
        let spacingBottom: number;
        if(this.printSettings) {
            legendYOffset = 0;
            marginBottom = 150;
            spacingBottom = 45;
        } else {
            legendYOffset = -5;
            marginBottom = 150;
            spacingBottom = 51;
        }
        var formatService = this.formatService;
        let tempChartData: BarChartData = {
            series: [],
            title: this.modelData.chartTitle,
            subtitle: this.modelData.filterDescription,
            displayText: this.modelData.displayText,
            categories: null,
            xAxisLabel: this.modelData.xAxis,
            yAxisLabel: this.modelData.yAxis,
            xAxisFormatter: null,
            drilldown: [],
            drillUpText: '<span style="font-size:9px">  Back to All Types </span><br/>' +
                            '<span style="font-size:9px"> of Incidents</span>',
            onDrillDown: null,
            onDrillUp: null,
            customChartSettings: {
                chart: {
                    marginLeft: 80,
                    marginTop: 80,
                    marginBottom: marginBottom,
                    spacingBottom: spacingBottom
                },
                title: {
                    text: (this.modelData.datasets && this.modelData.datasets.length > 0)? this.modelData.xAxis: '',
                    style: {
                        fontWeight: 'normal',
                        fontSize: '11px'
                    },
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: -30
                },
                subtitle:{
                    y: 15
                },
                xAxis: {
                    type: 'category',
                    categories: null,
                    title: {
                        style: {
                            fontWeight: 'bold',
                            fontSize: '11px',
                            color: 'transparent',
                        }
                    },
                    labels: {
                        rotation: 0,
                        step: 1,
                        style: {
                            fontSize: '10px',
                            textOverflow: 'none'
                        }
                    },
                    tickWidth: 0,
                    lineWidth: 2,
                },
                yAxis: {
                    lineWidth: 2,
                    tickInterval: 2,
                    gridLineWidth: 0,
                    title: {
                        text: this.modelData.yAxis,
                        style: {
                            fontSize: '11px'
                        }
                    },
                    labels: {
                        formatter: function() {
                            let value = 0;
                            if(this.value > 10) {
                                value = Math.pow(10, ((this.value -10) / 2) + 1);
                            } else {
                                value = this.value;
                            }

                            return formatService.tooltipFormatter(value);
                        }
                    },
                },
                legend: {
                    enabled: true,
                    symbolHeight: 8,
                    y: legendYOffset
                },
                tooltip: {
                    shared: false,
                    formatter: function () {
                        let value1 = this.point.y;
                        if(this.point.y > 10) {
                            value1 = Math.pow(10, ((this.point.y-10 + 2)/2)).toFixed(0);

                        }
                        let value = formatService.tooltipFormatter(value1);
                        return '<span style="font-size:11px">' + this.series.name + '</span><br>' +
                            '<span style="color:' + this.point.color + '">' + this.point.name + '</span>: <b>' + value + '</b><br/>';
                    }
                },
                plotOptions: {
                    scatter: {
                        enableMouseTracking: true,
                        stickyTracking:false
                    },
                    column:{
                        enableMouseTracking: true,
                        stickyTracking:false
                    },
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false,
                        },
                        marker: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                drilldown: {
                    activeAxisLabelStyle: {
                        textDecoration: 'none',
                        color: '#464646',
                        'font-weight': 'normal'
                    },
                    drillUpButton: {
                        relativeTo: 'spacingBox',
                        position: {
                            y: 20,
                            x: 0,
                        },
                        theme: {
                            height: 27,
                            width: 87,
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
                    }
                }
            },
            hasRedrawActions: true
        };
        this.displayText = this.modelData.displayText;

        let groups: FrequencyIncidentGroup[] = new Array();
        let groupNames = new Array();
        let groupDrilldownNames = new Array();
        let series = {};

        this.modelData.datasets.forEach(eachData => {
            if (!groupNames.join(',').includes(eachData.comp_or_peer)) {
                groupNames.push(eachData.comp_or_peer);
            }
        });

        groupNames.sort().reverse().forEach(name => {
            groups = this.modelData.datasets.filter(
                eachGroup => eachGroup.comp_or_peer === name && eachGroup.sub_type === null &&
                !(eachGroup.comp_or_peer === 'Company' && eachGroup.count < 1)
            );

            if (groups && groups.length > 0) {
                let series = this.getSeriesObject(name);
                series.data = groups.map(group => {
                    if (!groupDrilldownNames.join(',').includes(group.type)) {
                        if(group.count > 0) {
                            groupDrilldownNames.push(group.type);
                        }
                    }
                    return {
                        name: group.type,
                        y: this.getPlotValue(group.count),
                        drilldown: ( (!this.hasDetailAccess) || (group.comp_or_peer === 'Company') || (group.count <= 0) ) ? null : group.type
                    };
                });
                tempChartData.series.push(series);
            }
        });

        groupNames.forEach(name => {
            groupDrilldownNames.forEach(drilldownName => {
                groups = this.modelData.datasets.filter(
                    eachGroup => eachGroup.comp_or_peer === name && 
                    eachGroup.type === drilldownName && eachGroup.sub_type !== null &&
                    !(eachGroup.comp_or_peer === 'Company' && eachGroup.count < 1)
                );

                if (groups && groups.length > 0) {
                    let series = this.getSeriesObject(name);
                    series.id = drilldownName;
                    series.data = groups.map(group => {
                        return [
                            group.sub_type, this.getPlotValue(group.count)
                        ];
                    });
                    tempChartData.drilldown.push(series);
                }
            });

        });


        var defaultTitle = this.modelData.xAxis;
        var frequencyService = this.frequencyService;        
        tempChartData.onDrillDown = function (event, chart) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;
            e.preventDefault();
            frequencyService.setIncidentChartView(e.point.name);             
            drilldowns.forEach(function (p, i) {
                if (p.id.includes(e.point.name)) {
                    chart.addSingleSeriesAsDrilldown(e.point, p);
                    chart.setTitle({ text: 'Types of ' + e.point.name.replace('Violations', 'Violation') + ' Incidents' });
                }
            });
            chart.applyDrilldown();
        };

        tempChartData.onDrillUp = function (event, chart) {
            frequencyService.setIncidentChartView('main');   
            chart.setTitle({ text: defaultTitle });
        }

        if(this.modelData.maxValue === 0) {
            tempChartData.title = '';
            tempChartData.subtitle = '';
            tempChartData.customChartSettings.subtitle.text = '';
            tempChartData.customChartSettings.title.text = '';
            tempChartData.series = [];
            tempChartData.drilldown = [];
        }

        this.onDataComplete.emit(tempChartData);

    }

    getTickPosition(maxData: number) {
        let maxLog = Math.ceil(Math.log10(maxData));
        let tickPosition = new Array();

        for (let index = 0; index < maxLog; index++) {
            tickPosition.push(index + 1);
        }

        return tickPosition;
    }

    getPlotValue(value) {
        if(value < 11) {
            return value;
        } else {
            return 10 + (Math.log10(value) * 2) - 2;
        }
    }
}
