import { BaseChart } from '../../charts/base-chart';

import { BarChartData } from 'app/model/charts/bar-chart.model';
import { Directive, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FrequencyIndustryOverviewModel, ComponentPrintSettings } from "app/model/model";

@Directive({
    selector: '[frequency-industry-overview-behavior]'
})
export class FrequencyIndustryOverviewDirective implements OnInit, OnChanges {

    @Input() modelData: FrequencyIndustryOverviewModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    @Input() public printSettings: ComponentPrintSettings;

    ngOnChanges(changes: SimpleChanges) {}

    public static defaultLineColor: string = '#487AA1';
    static maxCharactersPerLine: number = 105;
    seriesColor: string[];
    categories:  any;

    displayText: string = '';

    constructor() {
        this.seriesColor = [];
        this.seriesColor["All Industries"] = '#B1D23B';
        this.categories =  ['Less than $25M', '$25M to < $100M', '$100M to < $250M', '$250M to < $500M', '$500M to < $1B', '$1B to Greater'];
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || FrequencyIndustryOverviewDirective.defaultLineColor;
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
                legendYOffset = 10;
                marginBottom = 125;
                spacingBottom = 45;
            } else {
                legendYOffset = 4;
                marginBottom = 150;
                spacingBottom = 51;
            }

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
                    marginLeft: 75,
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
                    yAxis: {
                        gridLineWidth: 0,
                        tickWidth: 1,
                        lineWidth: 1,
                        allowDecimals: false,
                        min: 0,
                        title: {
                            style: {
                                fontSize: '11px'
                            }
                        }

                    },
                    tooltip: {
                        headerFormat: '<span style="font-size:10px">{point.key}<br/></span><table>',
                        pointFormat: '<span style="color:{series.color};padding:0">{series.name}:<b>{point.y}</b><br/></span>',
                        positioner: function(labelWidth, labelHeight, point) {
                            let xPos = point.plotX;
                            let yPos = point.plotY;

                            if (xPos < 10 ) {
                                xPos = 20;
                            }

                            if (xPos + labelWidth > this.chart.chartWidth) {
                                xPos = this.chart.chartWidth - labelWidth - 5;
                            }

                            if ( yPos < labelHeight + 5) {
                                yPos = labelHeight + 5;
                            }

                            if ( yPos >= this.chart.plotHeight + this.chart.plotTop - labelHeight) {
                                yPos = this.chart.plotHeight + this.chart.plotTop - labelHeight - 5;
                            }

                            return { x: xPos, y: yPos};
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

}
