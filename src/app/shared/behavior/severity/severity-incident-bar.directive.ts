import { BaseChart } from '../../charts/base-chart';
import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Directive, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { SeverityIncidentBarModel, SeverityIncidentGroup } from "app/model/severity.model";
import { SearchService } from 'app/services/services';

@Directive({
    selector: '[severity-bar-incident]'
})
export class SeverityIncidentBarDirective {

    @Input() modelData: SeverityIncidentBarModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {}

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
        return this.seriesColor[seriesName] || SeverityIncidentBarDirective.defaultLineColor;
    }

    ngOnInit() {        
        this.getCompanyName();
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

    buildNoBreakChart() {
        let tickPosition = this.getTickPosition(this.modelData.maxValue);
        tickPosition.splice(0,0,-0.9, -0.01);
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
                    marginBottom: 135
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
                        tickPositions: tickPosition,
                        type:'logarithmic',
                        gridLineWidth: 0,  
                        tickWidth:0,
                        lineWidth: 0,
                        labels: {
                            format: '{value:,.0f}',
                            formatter: function() {
                                return (this.value.toString()).replace(
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
                            text: this.modelData.yAxis,
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
                        drilldown: (group.comp_or_peer === 'Company' || group.count <= 0) ? null : group.type
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

        tempChartData.onDrillDown = function (event, chart) {
            var e = event.originalEvent;
            var drilldowns = tempChartData.drilldown;

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
            drillUpText: '<span style="font-size:9px">  Back to All Types </span><br/>' +
                            '<span style="font-size:9px"> of Incidents</span>',
            onDrillDown: null,
            onDrillUp: null,
            customChartSettings: {
                chart: {
                    marginTop: 0,
                    marginLeft: this.getMarginLeft(),
                    spacingBottom: 45,
                    marginBottom: 135,
                    // width: 600,
                    // height: 250,
                    drilled: false,
                    className: 'incident-below1'
                },
                title: {
                    text: this.modelData.xAxis,
                    style: {
                        fontWeight: 'normal',
                        fontSize: '11px'
                    },
                    align: 'center',
                    verticalAlign: 'bottom',
                    y: -30
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
                        max: 10,
                        min: 0,
                        showLastLabel: false,
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
                    headerFormat: '<span style="font-size:11px">{series.name}</span> TEST <br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y} TEST</b><br/>'
                    /*shared: false,
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
                        return '<span style="color:' + this.point.color + '">' + this.point.name + '</span>: <b>' + value + '</b><br/>';
                    }*/
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
                    marginLeft: this.getMarginLeft(),
                    // width: 600,
                    // height: 150,
                    className: 'incident-upper1'
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
                        style: {
                            fontSize: '10px',
                            textOverflow: 'none'
                        }
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
                            formatter: function() {
                                return (this.value.toString()).replace(
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
                            formatter: function() {
                                return (this.value.toString()).replace(
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
                        height: '93%',
                        tickWidth: 0,
                        labels: {
                            formatter: function() {
                                return (this.value.toString()).replace(
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
                            formatter: function() {
                                return (this.value.toString()).replace(
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
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b><br/>'
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
                !(eachGroup.comp_or_peer === 'Company' && eachGroup.count < 1)
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
                        drilldown: (group.comp_or_peer === 'Company' || group.count < 1) ? null : group.type
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
                        otherChart.setTitle({ text: 'Types of ' + e.point.name.replace('Violations', 'Violation') + ' Incidents' });
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
    
    getMarginLeft() {
        let maxValue = this.modelData.maxValue;
        let marginLeft = 100;

        if(maxValue > 100000) {
            marginLeft = marginLeft + (maxValue.toString().length) * 5
        }

        return marginLeft;
    }
}
