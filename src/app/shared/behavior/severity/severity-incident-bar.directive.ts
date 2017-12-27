import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SeverityIncidentBarModel, SeverityIncidentGroup } from "app/model/severity.model";
import { SearchService, SessionService, SeverityService } from 'app/services/services';

@Directive({
    selector: '[severity-bar-incident]'
})
export class SeverityIncidentBarDirective {

    @Input() modelData: SeverityIncidentBarModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

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
    hasDetailAccess: boolean;
    seriesColor: string[];
    displayText: string = '';
    companyName: string = '';

    constructor(private searchService: SearchService, private sessionService: SessionService, private severityService: SeverityService) {
        this.seriesColor = [];
        this.seriesColor["Company"] = '#F68C20';
        this.seriesColor["Peer"] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || SeverityIncidentBarDirective.defaultLineColor;
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

    getDetailAccess() {
        let permission = this.sessionService.getUserPermission();
        this.hasDetailAccess = permission && permission.severity && permission.severity.incident && permission.severity.incident.hasDetailAccess;
    }

    buildNoBreakChart() {
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
                    marginLeft: this.getMarginLeft(),
					marginTop:80
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
                yAxis: [
                    {
                        type:'logarithmic',
                        breaks: [{
                            from: -0.125,
                            to: 1,
                            breakSize:1
                        }],
                        gridLineWidth: 0,  
                        tickWidth:0,
                        lineWidth: 2,
						tickPositioner: function() {
							let maxLog = Math.ceil(Math.log10(this.dataMax));
                            let tickPosition = [-0.9, -0.01, 1];
					
							for (let index = 1; index < maxLog; index++) {
								tickPosition.push(index + 1);
							}
							return tickPosition;
						},
                        labels: {
                            format: '{value:,.0f}',
                            formatter: function() {
                                return (this.value.toFixed().toString()).replace(
                                    /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function(match, sign, zeros, before, decimal, after) {
                                    var reverseString = function(string) { return string.split('').reverse().join(''); };
                                    var insertCommas  = function(string) { 
                                        var reversed  = reverseString(string);
                                        var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                        return reverseString(reversedWithCommas);
                                    };
                                    return sign + (decimal ? insertCommas(before) : insertCommas(before + after));
                                    }
                                );
                            }
                        },
                        title: {
                            text: '<div style="text-align:center;width:180px;margin:0 auto;">'+ this.modelData.yAxis +'</div>',
                            useHTML: true,
                            style:{
                                fontSize: '11px'
                            }
                        },
                        offset:-0.125        
                    }
                ],
                legend: {
                    enabled: true,
                    symbolHeight: 8
                },
                tooltip: {
                    shared: false,
                    formatter: function () {
                        let value =  (this.point.y.toString()).replace(
                            /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function(match, sign, zeros, before, decimal, after) {
                            var reverseString = function(string) { return string.split('').reverse().join(''); };
                            var insertCommas  = function(string) { 
                                var reversed  = reverseString(string);
                                var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                return reverseString(reversedWithCommas);
                            };
                            return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
                            }
                        );
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

        let groups: SeverityIncidentGroup[] = new Array();
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
                !(eachGroup.comp_or_peer === 'Company' && eachGroup.count <= 0)
            );

            if (groups && groups.length > 0) {
                let series = this.getSeriesObject(name);
                series.data = groups.map(group => {
                    if (!groupDrilldownNames.join(',').includes(group.type)) {
                        groupDrilldownNames.push(group.type);
                    }
                    return {
                        name: group.type,
                        y: group.count,
                        drilldown: ( (!this.hasDetailAccess) || group.comp_or_peer === 'Company' || group.count <= 0) ? null : group.type
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
                            group.sub_type, group.count
                        ];
                    });
                    tempChartData.drilldown.push(series);
                }
            });

        });

        var defaultTitle = this.modelData.xAxis;
        var severityService = this.severityService;   

        tempChartData.onDrillDown = function (event, chart) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;
            severityService.setIncidentChartView(e.point.name);            
            e.preventDefault();
            drilldowns.forEach(function (p, i) {
                if (p.id.includes(e.point.name)) {
                    chart.addSingleSeriesAsDrilldown(e.point, p);
                    chart.setTitle({ text: 'Types of ' + e.point.name.replace('Violations', 'Violation') + ' Incidents' });
                }

            });
            chart.applyDrilldown();
        };

        tempChartData.onDrillUp = function (event, chart) {
            severityService.setIncidentChartView('main');
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
    
    getMarginLeft() {
        let maxValue = this.modelData.maxValue;
        let maxCharactersLength:number = maxValue.toFixed(0).toString().length + 1;       
        let marginLeft = 60 + (maxCharactersLength * 8);

        return marginLeft;
    }
}
