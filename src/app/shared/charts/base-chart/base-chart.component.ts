
export class BaseChartComponent {

    chart: any;
    
    getHighChart(): any {
      return this.chart;
    }
    setHighChart(chart: any) {
      this.chart = chart;
    }

    chartOptions: any;
    getChartOptions(): any {
      return this.chartOptions;
    }
    setChartOptions(chartOptions: any) {
      this.chartOptions = chartOptions;
    }

    getTitle(): string {
        return this.chartOptions.title.text;
    }
    setTitle(title: string) {
        this.chartOptions.title.text = title;
    }
    getSubTitle(): string {
        return this.chartOptions.subtitle.text;
    }
    setSubTitle(subTitle: string) {
        this.chartOptions.subtitle.text = subTitle;
    }
    getXAxisTitle(): string {
        return this.chartOptions.xAxis.title.text;
    }
    setXAxisTitle(title: string) {
        this.chartOptions.xAxis.title.text = title;
    }
    getYAxisTitle(): string {
        return this.chartOptions.yAxis.title.text;
    }
    setYAxisTitle(title: string) {
        this.chartOptions.yAxis.title.text = title;
    }
    getDefaultChartType(): string {
        return this.chartOptions.chart.type;
    }
    setDefaultChartType(type: string) {
        this.chartOptions.chart.type = type;
    }
    getChartWidth(): number {
        return this.chartOptions.chart.width;
    }
    setChartWidth(width: number) {
        this.chartOptions.chart.width = width;
    }
    getChartHeight(): number {
        return this.chartOptions.chart.height;
    }
    setChartHeight(height: number) {
        this.chartOptions.chart.height = height;
    }

    constructor() {
        this.chartOptions = {
            chart: {
                //default chart type is line
                //chart type used when no chart type is specified under series
                type: 'line',
                marginLeft: 75,
                marginRight: 25,
                width: 600,
                height: 400
            },
            credits: {
                enabled: false
            },
            title: {
                text: 'Placeholder Title',
                style: {
                    fontSize: '14px'
                }
            },
            subtitle: {
                text: 'Placeholder Sub-Title'
            },
            xAxis: {
                type: 'category',
                categories: [],
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'Verdana, sans-serif',
                    },
                    //Set specific X-Axis series text color
                    formatter: null
                },
                title: {
                    text: 'X-Axis Placeholder',
                    style: {
                        fontSize: '11px'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Y-Axis Placeholder'
                }
            },
            legend: {
                shadow: false
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                        radius: 8
                    },
                    scatter: {
                        enableMouseTracking: false
                    },
                    events: {
                        legendItemClick: function () {
                            //return false to disable hiding of series when legend item is click
                            return false;
                        }
                    }
                },
                column: {
                    grouping: false,
                    shadow: false,
                    borderWidth: 0
                }
            },
            lang: {
                noData: "No Data Available"
            },
            noData: {
                style: {
                    fontWeight: 'bold',
                    fontSize: '15px',
                    color: '#FF0000'
                }
            },
            series: [
            ],
            navigation: {
                buttonOptions: {
                    enabled: false
                }
            }
        };
    }
}
