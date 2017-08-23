export interface GaugeChartData {
    series: any;
    title: string;
    subtitle: string;
    displayText: string;
    categories: any;
    xAxisLabel: string;
    yAxisLabel: string;
    xAxisFormatter: any;
    score: number;

    //Custom HighChart Settings that will be merged with current chart's options
    customChartSettings: any;
    //Indicate if there are any post render actions needed
    hasRedrawActions: boolean;
}