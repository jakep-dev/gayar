import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from '../../../model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FrequencyIncidentBarModel, FrequencyIncidentGroup } from "app/model/frequency.model";

@Directive({
    selector: '[frequeny-bar-incident]'
})
export class IncidentBarDirective {

    @Input() modelData: FrequencyIncidentBarModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;
            let labelHeight = 200;//((Math.ceil(this.displayText.length / BenchmarkLimitDistributionDirective.maxCharactersPerLine)) * 10);
            this.chartComponent.addChartLabel(
                this.displayText,
                10,
                this.chartComponent.chart.chartHeight - labelHeight,
                '#000000',
                10,
                null,
                this.chartComponent.chart.chartWidth - 85
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

    static maxCharactersPerLine: number = 105; //approximate max characters per line

    static CLIENT_LINE: string = "Client Line";

    seriesColor: string[];

    displayText: string = '';

    constructor() {
        this.seriesColor = [];
        this.seriesColor["Company"] = '#F68C20';
        this.seriesColor["Peer"] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || IncidentBarDirective.defaultLineColor;
    }

    ngOnInit() {
        this.buildHighChartObject();
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
                    name: 'Company',
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
        if (this.modelData && this.modelData.withBreak) {
            this.buildWithBreakChart();
        } else {
            this.buildNoBreakChart();
        }
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
            drillUpText: '< Back to all Types<br/> of Incidents',
            onDrillDown: null,
            onDrillUp: null,
            customChartSettings: {
                chart: {
                    marginLeft: 80,
                    spacingBottom: 0
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
                    },
                    tickWidth: 0,
                    lineWidth: 2,
                },
                yAxis: {
                    tickInterval: 2,
                    title: {
                        text: 'Number of Incidents',
                        style: {
                            fontSize: '11px'
                        }
                    }
                },
                legend: {
                    enabled: true,
                    symbolHeight: 8
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>'
                },
                plotOptions: {
                    scatter: {
                        enableMouseTracking: true,
                    },
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false,
                        },
                        scatter: {
                            enableMouseTracking: true
                        },
                        marker: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                drilldown: {
                    activeAxisLabelStyle: {
                        textDecoration: 'none'
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

        let groups: FrequencyIncidentGroup[] = new Array();
        let groupNames = new Array();
        let groupDrilldownNames = new Array();
        let series = {};

        this.modelData.datasets.forEach(eachData => {
            if (!groupNames.join(',').includes(eachData.comp_or_peer)) {
                groupNames.push(eachData.comp_or_peer);
            }
        });

        groupNames.forEach(name => {
            groups = this.modelData.datasets.filter(
                eachGroup => eachGroup.comp_or_peer === name && eachGroup.sub_type === null
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
                        drilldown: (group.comp_or_peer === 'Company') ? null : group.type
                    };
                });
                tempChartData.series.push(series);
            }
        });

        groupNames.forEach(name => {
            groupDrilldownNames.forEach(drilldownName => {
                groups = this.modelData.datasets.filter(
                    eachGroup => eachGroup.comp_or_peer === name && eachGroup.type === drilldownName && eachGroup.sub_type !== null
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

        tempChartData.onDrillDown = function (event, chart) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;

            e.preventDefault();
            drilldowns.forEach(function (p, i) {
                if (p.id.includes(e.point.name)) {
                    chart.addSingleSeriesAsDrilldown(e.point, p);
                    chart.setTitle({ text: 'Types of ' + e.point.name + ' Incidents' });
                }

            });
            chart.applyDrilldown();
        };

        tempChartData.onDrillUp = function (event, chart) {
            var chartTitle = 'Type of Incident';
            chart.setTitle({ text: chartTitle });
        }

        this.onDataComplete.emit(tempChartData);

    }

    buildWithBreakChart() {

        let tickPosition = this.getTickPosition(500);
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
            drillUpText: '< Back to all Types<br/> of Incidents',
            onDrillDown: null,
            onDrillUp: null,
            customChartSettings: {
                chart: {
                    marginTop: 0,
                    marginLeft: 70,
                    width: 600,
                    height: 250,
                    drilled: false
                },
                title: {
                    text: '',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '11px'
                    },
                    align: 'center',
                    y: 200
                },
                subtitle: {
                    text: false,
                    style: {
                        fontSize: '14px'
                    },
                    align: 'center',
                    y: 15
                },
                xAxis: {
                    type: 'category',
                    categories: null,
                    title: {
                        style: {
                            fontSize: '11px',
                            color: 'transparent',
                        }
                    },
                    labels: {
                        rotation: 0,
                    },
                    tickWidth: 0,
                    lineWidth: 2,
                },
                yAxis: [
                    //Column bars
                    {
                        max: 10,
                        min: 0,
                        tickInterval: 2,
                        gridLineWidth: 0,
                        tickWidth: 0,
                        lineWidth: 2,
                        labels: {
                            format: '{value:,.0f}',

                        },
                        title: {
                            text: 'Number of Incidents',
                            align: 'high',
                            style: {
                                fontSize: '11px'
                            }
                        }
                    },
                    {
                        max: 11,
                        min: 0,
                        tickInterval: 2,
                        gridLineWidth: 0,
                        tickWidth: 0,
                        lineWidth: 2,
                        labels: {
                            format: '{value:,.0f}',
                            style: {
                                color: 'transparent'
                            }
                        },
                        title: false,
                        zIndex: 3,
                        offset: -0.125
                    }],
                legend: {
                    enabled: true,
                    symbolHeight: 8
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                },
                plotOptions: {
                    scatter: {
                        enableMouseTracking: true,
                    },
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false,
                        },
                        scatter: {
                            enableMouseTracking: true
                        },
                        marker: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                drilldown: {
                    activeAxisLabelStyle: {
                        textDecoration: 'none'
                    },
                    drillUpButton: {
                        relativeTo: 'spacingBox',
                        position: {
                            y: 250,
                            x: 0,
                        },
                        theme: {
                            fill: 'transparent',
                            'stroke-width': 0,
                            stroke: 'transparent',
                            r: 0,
                            display: 'hidden',
                            states: {
                                hover: {
                                    fill: 'transparent'
                                },
                                select: {
                                    stroke: 'transparent',
                                    fill: 'transparent'
                                }
                            }
                        }
                    }
                }
            },
            breakChartSettings: {
                chart: {
                    marginTop: 60,
                    marginBottom: 0,
                    marginLeft: 70,
                    width: 600,
                    height: 150
                },
                title: {
                    text: this.modelData.chartTitle,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '11px'
                    },
                    align: 'center',
                },
                subtitle: {
                    text: this.modelData.filterDescription,
                    style: {
                        fontSize: '14px'
                    },
                    align: 'center'
                },
                xAxis: {
                    type: 'category',
                    categories: null,
                    title: {
                        style: {
                            fontSize: '11px',
                            color: 'transparent',
                        }
                    },
                    labels: {
                        rotation: 0,
                    },
                    tickWidth: 0,
                    lineWidth: 0,
                },
                yAxis: [
                    //Column bars
                    {
                        tickPositions: [1, 2, 3],//we can set yAxis values. This is set to 10-1000.
                        type: 'logarithmic',
                        gridLineWidth: 0,
                        tickWidth: 0,
                        lineWidth: 0,
                        labels: {
                            format: '{value:,.0f}',
                            style: {
                                color: 'transparent'
                            }
                        },
                        title: false
                    },
                    //placeholder for break yaxis
                    {
                        tickPositions: [1, 2, 3], //we can set yAxis values. This is set to 10-1000.
                        type: 'logarithmic',
                        overflow: 'justify',
                        breaks: [{
                            from: 1,
                            to: 2,
                            breakSize: 1
                        }],
                        gridLineWidth: 0,
                        tickWidth: 0,
                        lineWidth: 2,
                        labels: {
                            format: '{value:,.0f}'
                        },
                        //Number of Incidents
                        title: {
                            text: '',
                            style: {
                                fontWeight: 'bold',
                                fontSize: '11px'
                            }
                        },
                        offset: -0.125,

                    },
                    //set color on top break yaxis and set height to fit in top of the break point.
                    {
                        lineColor: "#ff0000",//here you can set the color
                        title: false,
                        lineWidth: 2,
                        height: '85%',//here you can set the height
                        tickWidth: 0,
                        labels: {
                            format: '{value:,.0f}',
                            style: {
                                color: 'transparent'
                            }
                        },
                        zIndex: 5,
                        offset: -0.125,
                    }, {
                        title: false,
                        lineWidth: 2,
                        height: '93.75%',//set break space through yaxis
                        tickWidth: 0,
                        gridLineWidth: 0,
                        tickPositions: [1, 2, 3],//we can set yAxis values. This is set to 10-1000.
                        type: 'logarithmic',
                        breaks: [{
                            from: 1,
                            to: 2,
                            breakSize: 1
                        }],
                        labels: {
                            format: '{value:,.0f}',
                            style: {
                                color: 'transparent'
                            }
                        },
                        zIndex: 4,
                        offset: -0.125,
                    }
                ],
                legend: {
                    enabled: false,
                    symbolHeight: 8
                },
                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> of total<br/>'
                },
                plotOptions: {
                    scatter: {
                        enableMouseTracking: true,
                    },
                    series: {
                        borderWidth: 0,
                        dataLabels: {
                            enabled: false,
                        },
                        scatter: {
                            enableMouseTracking: true
                        },
                        marker: {
                            enabled: true,
                            radius: 5
                        }
                    }
                },
                drilldown: {
                    activeAxisLabelStyle: {
                        textDecoration: 'none'
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

        let groups: FrequencyIncidentGroup[] = new Array();
        let groupNames = new Array();
        let groupDrilldownNames = new Array();
        let series = {};

        this.modelData.datasets.forEach(eachData => {
            if (!groupNames.join(',').includes(eachData.comp_or_peer)) {
                groupNames.push(eachData.comp_or_peer);
            }
        });

        groupNames.forEach(name => {
            groups = this.modelData.datasets.filter(
                eachGroup => eachGroup.comp_or_peer === name && eachGroup.sub_type === null
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
                        drilldown: (group.comp_or_peer === 'Company') ? null : group.type
                    };
                });
                tempChartData.series.push(series);
            }
        });

        groupNames.forEach(name => {
            groupDrilldownNames.forEach(drilldownName => {
                groups = this.modelData.datasets.filter(
                    eachGroup => eachGroup.comp_or_peer === name && eachGroup.type === drilldownName && eachGroup.sub_type !== null
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

        tempChartData.onDrillDown = function (event, chart, otherChart, withBreak) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;
            var pointIndex = e.point.index;

            if (!otherChart.options.chart.drilled) {
                chart.options.chart.drilled = true;
                otherChart.options.chart.drilled = true;
                otherChart.series[0].data[pointIndex].doDrilldown();
                console.log('drilldown other', otherChart);
            }

            e.preventDefault();
            drilldowns.forEach(function (p, i) {
                if (p.id.includes(e.point.name)) {
                    chart.addSingleSeriesAsDrilldown(e.point, p);
                    if (withBreak) {
                        chart.setTitle({ text: 'Types of ' + e.point.name + ' Incidents' });
                    }

                }

            });
            chart.applyDrilldown();

        };

        tempChartData.onDrillUp = function (event, chart, otherChart, withBreak) {
            var chartTitle = 'Type of Incident';

            if (otherChart.options.chart.drilled &&
                otherChart.drilldownLevels &&
                otherChart.drilldownLevels.length > 0) {
                chart.options.chart.drilled = false;
                otherChart.options.chart.drilled = !withBreak;
                console.log('drillup other', otherChart);
                otherChart.drillUp();
            }

            if (withBreak) {
                chart.setTitle({ text: chartTitle });
            }
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
}
