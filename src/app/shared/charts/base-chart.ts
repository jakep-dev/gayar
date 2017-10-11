
export abstract class BaseChart {

    chart: any;
    chartOptions: any;

    constructor() {
        this.initializeChart();
    }

    getHighChart(): any {
        return this.chart;
    }

    setHighChart(chart: any) {
        this.chart = chart;
    }

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

    getDrillUpText() {
        return this.chartOptions.lang.drillUpText;
    }

    setDrillUpText(text: string) {
        this.chartOptions.lang.drillUpText = text;
    }

    /**
     * initialize common options for all chart types
     */
    initializeChart() {
        this.chartOptions = {
            chart: {
                //default chart type is line
                //chart type used when no chart type is specified under series
                type: 'line',
                marginLeft: 30,
                marginRight: 30,
                spacingBottom: 35
            },
            credits: {
                enabled: false,
                text: '<span style="color:transparent;font-size:12px;">placeholder</span>',
                href: 'javascript:window.open("https://www.advisenltd.com", "_blank")'
            },
            title: {
                text: 'Placeholder Title',
                style: {
                    fontSize: '14px',
                    color: '#464646'
                },
                margin: 30
            },
            subtitle: {
                text: 'Placeholder Sub-Title',
                style: {
                    fontSize: '13px',
                    color: '#464646'
                }
            },
            xAxis: {
                type: 'category',
                categories: [],
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: '11px',
                        fontFamily: 'Verdana, sans-serif',
                        color: '#464646'
                    },
                    //Set specific X-Axis series text color
                    formatter: null
                },
                title: {
                    text: 'X-Axis Placeholder',
                    style: {
                        fontSize: '11px',
                        color: '#464646'
                    }
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Y-Axis Placeholder',
                    style: {
                        fontSize: '11px',
                        color: '#464646'
                    }
                },
                labels: {
                    style: {
                        color: '#464646'
                    }
                }
            },
            legend: {
                shadow: false,
                enabled: true,
                itemStyle: {
                    fontSize: '11px',
                    color: '#000000'
                }
            },
            tooltip: {
                shared: true
            },
            plotOptions: {
                scatter: {
                    enableMouseTracking: false,
                },
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
                noData: "No Data Available",
                drillUpText: ''
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

    /**
     * Add text labels on chart
     * @param text - text to add
     * @param xPos - x position of the chart
     * @param yPos - y position of the chart
     * @param color - text color
     * @param fontSize - text font size
     * @param fontWeight - text font weight
     * @param width - width of the container of the text
     */
    public addChartLabel(text: string, xPos: number, yPos: number, color: string, fontSize: number, fontWeight?: string, width?: number) {

        let render = this.chart.renderer.text(text, xPos, yPos);
        let css = {
            color: color || '#000',
            fontSize: (fontSize || 12) + 'px',
            fontWeight: fontWeight || 'normal'
        };

        let attr = {
            zIndex: 999
        };

        if (width) {
            css['width'] = width + 'px';
        }

        render.css(css)
        render.attr(attr);
        render.add();
    }

    /**
     * Add image on the chart
     * @param link - chart's url
     * @param xPos - x position of the chart
     * @param yPos - y position of the chart
     * @param width - width of the chart
     * @param height - height of the chart
     */
    public addChartImage(link: string, xPos: number, yPos: number, width: number, height: number) {

        this.chart.renderer.image(link, xPos, yPos, width, height).add();
    }

    /**
     * Add line on the chart
     * @param startPoint - starting point of the line [x, y]
     * @param linePoints - connecting points to create line
     * @param color - color of the line
     * @param width - width of the line
     */
    public addLine(startPoint:Array<number>, linePoints:Array<number>, color?: string, width?: number) {
        if(startPoint && startPoint.length > 0 &&
            linePoints && linePoints.length > 0) {
                let pathArray = ['M', 'L'];
                pathArray.splice(1, 0, ...startPoint);
                pathArray.splice(pathArray.length, 0 , ...linePoints);

                this.chart.renderer.path(pathArray)
                    .attr({
                        stroke: color || 'black',
                        'stroke-width': width || 1,
                        zIndex: 999
                    })
                    .add();
            }
    }

    /**
     * Get the Y-axis position based on the y point
     * @param yPoint - y point
     */
    public getYAxisPosition(yPoint: number) {
        let yOffSet = this.chart.chartHeight - this.chart.marginBottom; //position of Y axis
        let minYAxis = this.chart.yAxis[0].min; //
        let maxYAxis = this.chart.yAxis[0].max;
        let heightPerUnit = this.chart.plotHeight / ( maxYAxis - minYAxis); //height per y-axis unit

        return yOffSet - Math.round((yPoint - minYAxis) * heightPerUnit);
    }

    /**
     * Get the X-axis position based on the x point
     * @param xPoint - x point
     */
    public getXAxisPosition(xPoint: number) {
        let xOffSet = this.chart.plotLeft; //position of Y axis
        let widthPerUnit = this.chart.plotWidth / this.chart.xAxis[0].categories.length; //width per x-axis unit

        return xOffSet + Math.round(xPoint * widthPerUnit);
    }

}
