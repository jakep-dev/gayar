import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FrequencyTimePeriodModel, FrequencyTimePeriodGroup, ComponentPrintSettings } from "app/model/model";
import { SearchService, SessionService, FormatService } from 'app/services/services';

@Directive({
    selector: '[frequeny-time-period]'
})
export class FrequencyTimePeriodDirective {

    @Input() modelData: FrequencyTimePeriodModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    @Input() public printSettings: ComponentPrintSettings;

    ngOnChanges(changes: SimpleChanges) {}

    public static defaultLineColor: string = 'black';
    hasDetailAccess: boolean;
    seriesColor: string[];
    displayText: string = '';
    companyName: string = '';

    constructor(private searchService: SearchService, private sessionService: SessionService, private formatService: FormatService) {
        this.seriesColor = [];
        this.seriesColor["Company"] = '#F68C20';
        this.seriesColor["Peer"] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || FrequencyTimePeriodDirective.defaultLineColor;
    }

    ngOnInit() {
        this.getCompanyName();
        this.getDetailAccess();
        this.buildHighChartObject();
    }

    getCompanyName() {
        if (this.searchService.searchCriteria &&
            this.searchService.searchCriteria.type &&
            this.searchService.searchCriteria.type !== 'SEARCH_BY_MANUAL_INPUT' &&
            this.searchService.selectedCompany && 
            this.searchService.selectedCompany.companyName) {
                this.companyName = this.searchService.selectedCompany.companyName;
        } else if (this.searchService.searchCriteria && this.searchService.searchCriteria.value) {
            this.companyName = this.searchService.searchCriteria.value;
        }
    }

    getDetailAccess() {
        let permission = this.sessionService.getUserPermission();
        this.hasDetailAccess = permission && permission.frequency && permission.frequency.timePeriod && permission.frequency.timePeriod.hasDetailAccess;
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
            legendYOffset = -5;
            marginBottom = 115;
            spacingBottom = 50;
        } else {
            legendYOffset = 0;
            marginBottom = 140;
            spacingBottom = 70;
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
            drillUpText: '<span style="font-size:9px">  Back to All Time </span><br/>' +
                            '<span style="font-size:9px"> Periods</span>',
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
                        step: 1
                    },
                    tickWidth: 0,
                    lineWidth: 2
                },
                yAxis: {
                    tickInterval: 2,
                    gridLineWidth: 0,
                    lineWidth: 2,
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
                         
                        let value =  formatService.tooltipFormatter(value1);
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

        let groups: FrequencyTimePeriodGroup[] = new Array();
        let groupNames = new Array();
        let groupDrilldownNames = new Array();
        let series = {};
        var defaultTitle = this.modelData.xAxis;

        this.modelData.datasets.forEach(eachData => {
            if (!groupNames.join(',').includes(eachData.compOrPeer)) {
                groupNames.push(eachData.compOrPeer);
            }
        });

        groupNames.sort().reverse().forEach(name => {
            let mainGroup = this.modelData.datasets.filter(
                eachGroup => eachGroup.compOrPeer === name && eachGroup.ruleTypeCode === 'TPS' &&
                !(eachGroup.compOrPeer === 'Company' && eachGroup.count < 1)
            );

            if (mainGroup && mainGroup.length > 0) {
                let series = this.getSeriesObject(name);
                series.data = mainGroup.map(eachGroup => {
                    return {
                        name: eachGroup.period,
                        drilldown: ( (!this.hasDetailAccess) || eachGroup.compOrPeer === 'Company' || eachGroup.count < 1) ? null : eachGroup.period,
                        y: this.getPlotValue(eachGroup.count)
                    }
                });
                tempChartData.series.push(series);

                mainGroup.forEach(eachMainGroup => {
                    let detailedGroup = this.modelData.datasets.filter(
                        eachGroup => eachGroup.compOrPeer === name && 
                        eachGroup.ruleTypeCode === 'TPC' && 
                        eachGroup.ruleTypeSubCode < eachMainGroup.ruleTypeSubCode &&
                        !(eachGroup.compOrPeer === 'Company' && eachGroup.count < 1)
                    );

                    if(detailedGroup && detailedGroup.length > 0) {
                        detailedGroup = detailedGroup.sort( eachGroup => Number(eachGroup.period));
                        let series = this.getSeriesObject(name);
                        series.id = eachMainGroup.period;
                        series.data = detailedGroup.map(group => {
                            return [
                                group.period, this.getPlotValue(group.count)
                            ];
                        });
                        tempChartData.drilldown.push(series);
                    }
                });
            }
        });

        tempChartData.onDrillDown = function (event, chart) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;

            e.preventDefault();
            drilldowns.forEach(function (p, i) {
                if (p.id.includes(e.point.name)) {
                    chart.addSingleSeriesAsDrilldown(e.point, p);
                    chart.setTitle({ text: 'Year' });
                }

            });
            chart.applyDrilldown();
        };

        tempChartData.onDrillUp = function (event, chart) {
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
