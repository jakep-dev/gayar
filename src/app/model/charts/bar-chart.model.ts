export interface BarChartData {
    series: any;
    title: string;
    subtitle: string;
    displayText: string;
    categories: any;
    xAxisLabel: string;
    yAxisLabel: string;
    xAxisFormatter: any;

    //Custom HighChart Settings that will be merged with current chart's options
    customChartSettings: any;
    //Indicate if there are any post render actions needed
    hasRedrawActions: boolean;
    
    //inidcate if has break
    withBreak?: boolean;
    breakChartSettings?: any;

    //Drilldown optional properties
    drilldown?: any;
    drillUpText?: string;
    onDrillDown?: any;
    onDrillUp?: any;
}