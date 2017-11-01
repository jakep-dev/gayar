import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

export const HighchartsFactory =  function () {
    var highChartsMain = require('highcharts');
    var drillDownCharts = require('highcharts/modules/drilldown');
    var noDataSupport = require('highcharts/modules/no-data-to-display');
    var highChartAdditionalCharts = require('highcharts/highcharts-more');
    var highChartExport = require('highcharts/modules/exporting');
    var solidGaugeCharts = require('highcharts/modules/solid-gauge');
    //var canvasTools = require('highcharts/modules/canvas-tools');

    drillDownCharts(highChartsMain);
    noDataSupport(highChartsMain);
    highChartAdditionalCharts(highChartsMain);
    highChartExport(highChartsMain);
    solidGaugeCharts(highChartsMain);
    // canvasTools(highChartsMain);
    return highChartsMain;
}

export const HighchartsProvider = {
    provide: HighchartsStatic,
    useFactory: HighchartsFactory
};