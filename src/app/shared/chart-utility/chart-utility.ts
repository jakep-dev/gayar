export class ChartUtility {

    public static defaultLineColor: string = 'black';
    seriesColor: string[];

    constructor() {
        this.seriesColor = [];
        this.seriesColor["Above Client"] = '#F68C20';
        this.seriesColor["Below Client"] = '#B1D23B';
        this.seriesColor["Client Line"] = '#487AA1';
    }

    public getCommonChartOptions() {
        return {
            chart: {
                type: '',
                width: 700,
                height: 400,
                marginRight: 25,
                marginLeft: 75,
                spacingBottom: 20
            },
            credits: {
                enabled: true,
                text: '<span style="color:transparent;font-size:12px;">placeholder</span>',
                href: 'javascript:window.open("https://www.advisenltd.com", "_blank")'
            },
            title: {
                text: 'Placeholder Title',
                fontSize: '14px'
            },
            subtitle: {
                text: 'Placeholder Sub-Title'
            },
            xAxis: {
            },
            yAxis: {
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
            },
            plotOptions: {
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

    public addChartLabel(chart: any, text: string, xPos: number, yPos: number, color: string, fontSize: number, fontWeight: string) {

        chart.renderer.text(text, xPos, yPos)
            .css({
                color: color || '#000',
                fontSize: (fontSize || 12) + 'px',
                fontWeight: fontWeight || 'normal'
            })
            .attr({
                zIndex: 999
            }).add();
    }

    public addChartImage(chart: any, link: string, xPos: number, yPos: number, width: number, height: number) {

        chart.renderer.image(link, xPos, yPos, width, height).add();
    }

    public getSeriesColor(seriesName: string) {
        return this.seriesColor[seriesName] || ChartUtility.defaultLineColor;
    }

    //get the pixel of y point from top
    public getYAxisPosition(chart: any, yPoint: number) {
        var yOffSet = chart.chartHeight - chart.marginBottom; //position of Y axis
        var heightPerUnit = chart.plotHeight / chart.yAxis[0].max; //height per y-axis unit

        return yOffSet - Math.round(yPoint * heightPerUnit);
    }

    //get the pixel of y point from top
    public getXAxisPosition(chart: any, xPoint: number) {
        var xOffSet = chart.plotLeft; //position of Y axis
        var widthPerUnit = chart.plotWidth / chart.xAxis[0].categories.length; //width per x-axis unit

        return xOffSet + Math.round(xPoint * widthPerUnit);
    }

    public chartToAdvisen(chart: any) {

    }
}