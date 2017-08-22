
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

        /**
         * initialize common options for all chart types
         */
        initializeChart() {
            this.chartOptions = {
                chart: {
                    //default chart type is line
                    //chart type used when no chart type is specified under series
                    type: 'line',
                    marginLeft: 75,
                    marginRight: 25,
                    spacingBottom: 20,
                    width: 600,
                    height: 400
                },
                credits: {
                    enabled: false,
                    text: '<span style="color:transparent;font-size:12px;">placeholder</span>',
                    href: 'javascript:window.open("https://www.advisenltd.com", "_blank")'
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
                        text: 'Y-Axis Placeholder',
                        style: {
                            fontSize: '11px'
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
    
        /**
         * Add text labels on chart
         * @param chart - Highchart object
         * @param text - text to add
         * @param xPos - x position of the chart
         * @param yPos - y position of the chart
         * @param color - text color
         * @param fontSize - text font size
         * @param fontWeight - text font weight
         * @param width - width of the container of the text
         */
        public addChartLabel(chart: any, text: string, xPos: number, yPos: number, color: string, fontSize: number, fontWeight?: string, width?: number) {
    
            let render = chart.renderer.text(text, xPos, yPos);
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
         * @param chart Highchart object
         * @param link - chart's url
         * @param xPos - x position of the chart
         * @param yPos - y position of the chart
         * @param width - width of the chart
         * @param height - height of the chart
         */
        public addChartImage(chart: any, link: string, xPos: number, yPos: number, width: number, height: number) {
    
            chart.renderer.image(link, xPos, yPos, width, height).add();
        }
    
        /**
         * Get the Y-axis position based on the y point
         * @param chart - Highchart object
         * @param yPoint - y point
         */
        public getYAxisPosition(chart: any, yPoint: number) {
            let yOffSet = chart.chartHeight - chart.marginBottom; //position of Y axis
            let heightPerUnit = chart.plotHeight / chart.yAxis[0].max; //height per y-axis unit
    
            return yOffSet - Math.round(yPoint * heightPerUnit);
        }
    
        /**
         * Get the X-axis position based on the x point
         * @param chart - Highchart object
         * @param xPoint - x point
         */
        public getXAxisPosition(chart: any, xPoint: number) {
            let xOffSet = chart.plotLeft; //position of Y axis
            let widthPerUnit = chart.plotWidth / chart.xAxis[0].categories.length; //width per x-axis unit
    
            return xOffSet + Math.round(xPoint * widthPerUnit);
        }
    
    }
    