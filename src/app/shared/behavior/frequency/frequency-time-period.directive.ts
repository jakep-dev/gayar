import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from '../../../model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FrequencyTimePeriodModel, FrequencyTimePeriodGroup } from "app/model/frequency.model";
import { SearchService } from './../../../services/services';

@Directive({
    selector: '[frequeny-time-period]'
})
export class FrequencyTimePeriodDirective {

    @Input() modelData: FrequencyTimePeriodModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['chartComponent'] && changes['chartComponent'].currentValue) {
            this.chartComponent = changes['chartComponent'].currentValue;

            if(this.modelData.datasets && this.modelData.datasets.length > 0) {
                if(this.displayText && this.displayText.length > 0) {
                    let labelHeight = (Math.ceil((this.displayText.length * 6) / (this.chartComponent.chart.chartWidth - 85))) * 10;
                    
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
    seriesColor: string[];
    displayText: string = '';
    companyName: string = '';

    constructor(private searchService: SearchService) {
        this.seriesColor = [];
        this.seriesColor["Company"] = '#F68C20';
        this.seriesColor["Peer"] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || FrequencyTimePeriodDirective.defaultLineColor;
    }

    ngOnInit() {
        this.getCompanyName();
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
            drillUpText: '<span style="font-size:9px">  Back to All Time </span><br/>' +
                            '<span style="font-size:9px"> Periods</span>',
            onDrillDown: null,
            onDrillUp: null,
            customChartSettings: {
                chart: {
                    marginLeft: 80
                },
                title: {
                    text: (this.modelData.datasets && this.modelData.datasets.length > 0)? this.modelData.xAxis: '',
                    style: {
                        fontWeight: 'bold',
                        fontSize: '11px'
                    },
                    align: 'center',
                    y: 320
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
                        text: this.modelData.yAxis,
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

        groupNames = groupNames.reverse();        
        groupNames.forEach(name => {
            let mainGroup = this.modelData.datasets.filter(
                eachGroup => eachGroup.compOrPeer === name && eachGroup.ruleTypeCode === 'TPS'
            );

            if (mainGroup && mainGroup.length > 0) {
                let series = this.getSeriesObject(name);
                series.data = mainGroup.map(eachGroup => {
                    return {
                        name: eachGroup.period,
                        drilldown: eachGroup.compOrPeer,
                        y: eachGroup.count
                    }
                });
                tempChartData.series.push(series);

                mainGroup.forEach(eachMainGroup => {
                    let detailedGroup = this.modelData.datasets.filter(
                        eachGroup => eachGroup.compOrPeer === name && 
                        eachGroup.ruleTypeCode === 'TPC' && 
                        eachGroup.ruleTypeSubCode <= eachMainGroup.ruleTypeSubCode
                    );

                    if(detailedGroup && detailedGroup.length > 0) {
                        detailedGroup = detailedGroup.sort( eachGroup => Number(eachGroup.period));
                        let series = this.getSeriesObject(name);
                        series.id = eachMainGroup.period;
                        series.data = detailedGroup.map(group => {
                            return [
                                group.period, group.count
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

        this.onDataComplete.emit(tempChartData);

    }

    buildWithBreakChart() {
        let tickPosition = this.getTickPosition(this.modelData.maxValue);
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
                    marginTop: 0,
                    marginLeft: 70,
                    spacingBottom: 35,
                    width: 600,
                    height: 250,
                    drilled: false
                },
                title: {
                    text: this.modelData.xAxis,
                    style: {
                        fontWeight: 'bold',
                        fontSize: '11px'
                    },
                    align: 'center',
                    y: 180
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
                    {
                        max: 10,
                        min: 0,
                        tickInterval: 2,
                        gridLineWidth: 0,
                        tickWidth: 0,
                        lineWidth: 2,
                        labels: {
                            format: '{value:,.0f}'
                        },
                        title: {
                            text: this.modelData.yAxis,
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
                    text: '',
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
                    {
                        tickPositions: tickPosition,
                        type: 'logarithmic',
                        gridLineWidth: 0,
                        tickWidth: 0,
                        lineWidth: 0,
                        labels: {
                            format: '{value:,.0f}',
                            formatter: function () {
                                return (this.value.toString()).replace(
                                    /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function (match, sign, zeros, before, decimal, after) {
                                        var reverseString = function (string) { return string.split('').reverse().join(''); };
                                        var insertCommas = function (string) {
                                            var reversed = reverseString(string);
                                            var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                            return reverseString(reversedWithCommas);
                                        };
                                        return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
                                    }
                                );
                            },
                            style: {
                                color: 'transparent'
                            }
                        },
                        title: false
                    },
                    {
                        tickPositions: tickPosition,
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
                            formatter: function () {
                                return (this.value.toString()).replace(
                                    /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function (match, sign, zeros, before, decimal, after) {
                                        var reverseString = function (string) { return string.split('').reverse().join(''); };
                                        var insertCommas = function (string) {
                                            var reversed = reverseString(string);
                                            var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                            return reverseString(reversedWithCommas);
                                        };
                                        return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
                                    }
                                );
                            }
                        },
                        title: {
                            text: '',
                            style: {
                                fontWeight: 'bold',
                                fontSize: '11px'
                            }
                        },
                        offset: -0.125,

                    },
                    {
                        lineColor: "#ff0000",
                        title: false,
                        lineWidth: 2,
                        height: '85%',
                        tickWidth: 0,
                        labels: {
                            formatter: function () {
                                return (this.value.toString()).replace(
                                    /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function (match, sign, zeros, before, decimal, after) {
                                        var reverseString = function (string) { return string.split('').reverse().join(''); };
                                        var insertCommas = function (string) {
                                            var reversed = reverseString(string);
                                            var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                            return reverseString(reversedWithCommas);
                                        };
                                        return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
                                    }
                                );
                            },
                            style: {
                                color: 'transparent'
                            }
                        },
                        zIndex: 5,
                        offset: -0.125,
                    }, {
                        title: false,
                        lineWidth: 2,
                        height: '93.75%',
                        tickWidth: 0,
                        gridLineWidth: 0,
                        tickPositions: tickPosition,
                        type: 'logarithmic',
                        breaks: [{
                            from: 1,
                            to: 2,
                            breakSize: 1
                        }],
                        labels: {
                            formatter: function () {
                                return (this.value.toString()).replace(
                                    /^([-+]?)(0?)(\d+)(.?)(\d+)$/g, function (match, sign, zeros, before, decimal, after) {
                                        var reverseString = function (string) { return string.split('').reverse().join(''); };
                                        var insertCommas = function (string) {
                                            var reversed = reverseString(string);
                                            var reversedWithCommas = reversed.match(/.{1,3}/g).join(',');
                                            return reverseString(reversedWithCommas);
                                        };
                                        return sign + (decimal ? insertCommas(before) + decimal + after : insertCommas(before + after));
                                    }
                                );
                            },
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

        this.displayText = this.modelData.displayText;

        let groups: FrequencyTimePeriodGroup[] = new Array();
        let groupNames = new Array();
        let groupDrilldownNames = new Array();
        let series = {};

        this.modelData.datasets.forEach(eachData => {
            if (!groupNames.join(',').includes(eachData.compOrPeer)) {
                groupNames.push(eachData.compOrPeer);
            }
        });

        groupNames.sort().reverse().forEach(name => {
            let mainGroup = this.modelData.datasets.filter(
                eachGroup => eachGroup.compOrPeer === name && eachGroup.ruleTypeCode === 'TPS'
            );

            if (mainGroup && mainGroup.length > 0) {
                let series = this.getSeriesObject(name);
                series.data = mainGroup.map(eachGroup => {
                    return {
                        name: eachGroup.period,
                        drilldown: eachGroup.compOrPeer,
                        y: eachGroup.count
                    }
                });
                tempChartData.series.push(series);

                mainGroup.forEach(eachMainGroup => {
                    let detailedGroup = this.modelData.datasets.filter(
                        eachGroup => eachGroup.compOrPeer === name && 
                        eachGroup.ruleTypeCode === 'TPC' && 
                        eachGroup.ruleTypeSubCode <= eachMainGroup.ruleTypeSubCode
                    );

                    if(detailedGroup && detailedGroup.length > 0) {
                        detailedGroup = detailedGroup.sort( eachGroup => Number(eachGroup.period));
                        let series = this.getSeriesObject(name);
                        series.id = eachMainGroup.period;
                        series.data = detailedGroup.map(group => {
                            return [
                                group.period, group.count
                            ];
                        });
                        tempChartData.drilldown.push(series);
                    }
                });
            }
        });
        
        var defaultTitle = this.modelData.xAxis;

        tempChartData.onDrillDown = function (event, chart, otherChart, withBreak) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;
            var pointIndex = e.point.index;

            if (!otherChart.options.chart.drilled) {
                chart.options.chart.drilled = true;
                otherChart.options.chart.drilled = true;
                otherChart.series[0].data[pointIndex].doDrilldown();
            }

            e.preventDefault();
            drilldowns.forEach(function (p, i) {
                if (p.id.includes(e.point.name)) {
                    chart.addSingleSeriesAsDrilldown(e.point, p);
                    if (withBreak) {
                        otherChart.setTitle({ text: 'Year' });
                    }
                }
            });
            chart.applyDrilldown();

        };

        tempChartData.onDrillUp = function (event, chart, otherChart, withBreak) {

            if (otherChart.options.chart.drilled &&
                otherChart.drilldownLevels &&
                otherChart.drilldownLevels.length > 0) {
                chart.options.chart.drilled = false;
                otherChart.options.chart.drilled = !withBreak;
                otherChart.drillUp();
            }

            if (withBreak) {
                otherChart.setTitle({ text: defaultTitle });
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
