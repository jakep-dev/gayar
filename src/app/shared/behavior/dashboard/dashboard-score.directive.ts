import { Directive, Output, Input, EventEmitter, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { DashboardScoreModel, GaugeChartData } from 'app/model/model';
import { BaseChart } from './../../charts/base-chart';

@Directive({
    selector: '[dashboard-score]'
})
export class DashboardScoreDirective implements OnInit, OnChanges {

    @Input() modelData: DashboardScoreModel;

    @Output() onDataComplete = new EventEmitter<GaugeChartData>();

    @Input() chartComponent: BaseChart;
    
    ngOnChanges(changes: SimpleChanges) {}

    public static defaultLineColor: string = 'black';

    static CLIENT_LINE: string = "Client Line";

    seriesColor: string[];

    displayText: string = '';

    constructor() {
        this.seriesColor = [];
        this.seriesColor["Above Client"] = '#F68C20';
        this.seriesColor["Below Client"] = '#B1D23B';
        this.seriesColor[DashboardScoreDirective.CLIENT_LINE] = '#487AA1';
    }

    private getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || DashboardScoreDirective.defaultLineColor;
    }

    ngOnInit() {
        this.buildHighChartObject();
    }

    /**
     * Use chart data from web service to build parts of Highchart chart options object
     */
    buildHighChartObject() {
        if (this.modelData) {
            let tempChartData: GaugeChartData = {
                categories: [],
                series: [
                    {
                        data: []
                    }
                ],
                subtitle: '',
                title: '',
                displayText: this.modelData.displayText,
                xAxisFormatter: null,
                xAxisLabel: '',
                yAxisLabel: '',
                customChartSettings: {
                    chart: {
                        type: 'solidgauge',
                        marginLeft: 30,
                        marginRight:30,
                        marginTop: 5
                    },
                    title: null,
                    pane: {
                        center: ['50%', '70%'],
                        size: '100%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {
                            backgroundColor: '#EEE',
                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },
                    tooltip: {
                        enabled: false
                    },
                    // the value axis
                    yAxis: {
                        stops: [
                            [0.1, '#55BF3B'], // green
                            [0.5, '#DDDF0D'], // yellow
                            [0.9, '#DF5353'] // red
                        ],
                        lineWidth: 0,
                        minorTickInterval: null,
                        tickAmount: 2,
                        title: {
                            y: 80,
                            text: '',
                            style:{
                                color: "#000000",
                                fontSize: "50px"
                            },
                        },
                        labels: {
                            style:{
                                color: "#000000",
                                fontSize: "15px"
                            },
                            // Bottom Label Offset
                            y: 20,
                            distance: -33,
                        }
                    },
                    plotOptions: {
                        solidgauge: {
                            dataLabels: {
                                y: 5,
                                borderWidth: 0,
                                useHTML: true
                            }
                        }
                    },
                    credits: {
                        enabled: false
                    },
                    series: [
                        {
                            name: '',
                            data: [],
                            dataLabels: {
                              format: '<div style="text-align:center"><span style="font-size:50px;color:' +
                                    'black;display:none">{y}</span><br/></div>'
                            },
                            tooltip: {
                              valueSuffix: null
                            }
                        }
                    ]
                }, 
                hasRedrawActions: true,
            }

            if (this.modelData && this.modelData.score !== null && this.modelData.score.finalScore !== null) {
                tempChartData.series[0].data.push(this.modelData.score.finalScore);
                tempChartData.customChartSettings.series[0].data.push(this.modelData.score.finalScore);
                tempChartData.customChartSettings.yAxis.title.text = this.modelData.score.finalScore;
                tempChartData.customChartSettings.yAxis.min = 0;
                tempChartData.customChartSettings.yAxis.max = 100;

            }
            
            this.displayText = this.modelData.displayText;
            this.onDataComplete.emit(tempChartData)
        }
    }

}
