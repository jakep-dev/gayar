import { BaseChart } from '../../charts/base-chart';

import { BarChartData } from '../../../model/charts/bar-chart.model';
import { Directive, OnInit, OnChanges, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FrequencyIndustryOverviewModel } from "app/model/model";

@Directive({
    selector: '[frequency-industry-overview-behavior]'
})
export class FrequencyIndustryOverviewDirective implements OnInit, OnChanges {

    @Input() modelData: FrequencyIndustryOverviewModel;

    @Output() onDataComplete = new EventEmitter<BarChartData>();

    @Input() chartComponent: BaseChart;

    ngOnChanges(changes: SimpleChanges) {       
        if (changes['chartComponent'] && changes['chartComponent'].currentValue != undefined) {
            this.chartComponent = changes['chartComponent'].currentValue;   
            if(this.modelData.datasets && this.modelData.datasets.length > 0) {
                if(this.displayText && this.displayText.length > 0) { 
                    let labelHeight = ((Math.ceil(this.displayText.length / FrequencyIndustryOverviewDirective.maxCharactersPerLine)) * 10);
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
  
    public static defaultLineColor: string = '#487AA1';
    static maxCharactersPerLine: number = 105;
    seriesColor: string[];
    categories:  any;

    displayText: string = '';

    constructor() {
        this.seriesColor = [];     
        this.seriesColor["All Industries"] = '#B1D23B';        
        this.categories =  ['Less Than $25M', '$25M to < $100M', '$100M to < $250M', '$250M to < $500M', '$500M to < $1B', '$1B to Greater'];
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
                    marginRight: 25
                   },                
                    xAxis: {
                        type: 'category',
                        labels: {
                            rotation: 0,
                            step: 1
                        },
                        title: {
                            style: {          
                                fontWeight: 'bold',                       
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
                        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                        '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                        footerFormat: '</table>',
                        shared: true,
                        useHTML: true
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
                        symbolHeight: 8
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
