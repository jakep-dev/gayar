import {SearchService} from '../../services/search.service';
import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkRateModel, BoxPlotChartData, BenchmarkRateInput, ComponentPrintSettings } from 'app/model/model';
import { BenchmarkService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit {

    chartHeader:string = '';
    modelData: BenchmarkRateModel;
    companyName: string;

    setModelData(modelData: BenchmarkRateModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: BoxPlotChartData;

    @Input() componentData: BenchmarkRateInput;

    @Input() printSettings: ComponentPrintSettings;

    /**
     * Event handler to indicate the construction of the BoxPlotChart's required data is built 
     * @param newChartData BoxPlotChart's required data
     */
    onDataComplete(newChartData : BoxPlotChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    public chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
    private isFirstRedrawComplete = new BehaviorSubject<Boolean>(false);
    public isFirstRedrawComplete$: Observable<Boolean> = this.isFirstRedrawComplete.asObservable();
    
    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        chart.removeRenderedObjects();
        this.chartComponent.next(chart);
        this.addLabelAndImage(chart);
        if(!this.isFirstRedrawComplete.getValue()) {
            this.isFirstRedrawComplete.next(true);
        }
    }

    addLabelAndImage(chart: BaseChart){
        let lineColor = 'gray';
        let lineWidth = 1;
        let label = '';
        let labelHeight = 10;
        let xPos = 0;
        let yPos = 0;
        let companyNameHeight = 0;
        let yCompanyPosition = 0;
        let hasClientLimit = this.searchService.searchCriteria.premium &&
            this.searchService.searchCriteria.premium != '0' &&
            this.searchService.searchCriteria.limit &&
            this.searchService.searchCriteria.limit != '0';

        if (hasClientLimit) {
            companyNameHeight = (Math.ceil((this.companyName.length * 6) / 200)) * labelHeight;
            yCompanyPosition = chart.getYAxisPosition(this.modelData.quartile.clientRPMPercentileValue) - 4;
            chart.addChartLabel(
                this.companyName,
                chart.getXAxisPosition(3.2),
                yCompanyPosition,
                null,
                labelHeight,
                'bold',
                200
            );

            chart.addChartLabel(
                this.ordinalSuffix(this.modelData.quartile.clientRPMPercentile) + '% ' + this.modelData.quartile.clientRPMPercentileValue_KMB,
                chart.getXAxisPosition(0.2),
                yCompanyPosition,
                null,
                labelHeight,
                'bold'
            );
        }

        label = 'Min ' + this.modelData.quartile.minRPM_KMB;
        xPos = chart.getXAxisPosition(2) - (label.length * 7);
        yPos = chart.getYAxisPosition(this.modelData.quartile.minRPM) + 15;

        chart.addChartLabel(
            label,
            xPos,
            yPos,
            null,
            labelHeight,
            'bold'
        );
        chart.addLine([xPos + (label.length * 7), yPos - 3],
            [xPos + (label.length * 7) + 10, yPos - 3, chart.getXAxisPosition(2.3), chart.getYAxisPosition(this.modelData.quartile.minRPM)],
            lineColor,
            lineWidth);

        label = 'Max ' + this.modelData.quartile.maxRPM_KMB;
        xPos = chart.getXAxisPosition(2) - (label.length * 7);
        yPos = chart.getYAxisPosition(this.modelData.quartile.maxRPM) - 10;

        chart.addChartLabel(
            label,
            xPos,
            yPos,
            null,
            labelHeight,
            'bold'
        );
        chart.addLine([xPos + (label.length * 7), yPos - 3],
            [xPos + (label.length * 7) + 10, yPos - 3, chart.getXAxisPosition(2.3), chart.getYAxisPosition(this.modelData.quartile.maxRPM) - 1],
            lineColor,
            lineWidth);

        label = '25th% ' + this.modelData.quartile.firstQuartile_KMB;
        xPos = chart.getXAxisPosition(3);
        yPos = chart.getYAxisPosition(this.modelData.quartile.firstQuartile) + 15;

        if(hasClientLimit 
            && yPos + labelHeight >= yCompanyPosition
            && yPos <= yCompanyPosition + companyNameHeight) {
            yPos = yCompanyPosition + companyNameHeight + 15;
        }

        chart.addChartLabel(
            label,
            xPos,
            yPos,
            null,
            labelHeight,
            'bold'
        );
        chart.addLine([xPos, yPos - 3],
            [xPos - 10, yPos - 3, chart.getXAxisPosition(2.8), chart.getYAxisPosition(this.modelData.quartile.firstQuartile)],
            lineColor,
            lineWidth);

        label = '75th% ' + this.modelData.quartile.fourthQuartile_KMB;
        xPos = chart.getXAxisPosition(3);
        yPos = chart.getYAxisPosition(this.modelData.quartile.fourthQuartile) - 10;

        if(hasClientLimit 
            && yPos + labelHeight >= yCompanyPosition
            && yPos <= yCompanyPosition + companyNameHeight) {
            yPos = yCompanyPosition - 15;
        }

        chart.addChartLabel(
            label,
            xPos,
            yPos,
            null,
            labelHeight,
            'bold'
        );
        chart.addLine([xPos, yPos - 3],
            [xPos - 10, yPos - 3, chart.getXAxisPosition(2.8), chart.getYAxisPosition(this.modelData.quartile.fourthQuartile) - 1],
            lineColor,
            lineWidth);

        chart.addChartLabel(
            'Median ' + this.modelData.quartile.median_KMB,
            chart.getXAxisPosition(2) - (('Median ' + this.modelData.quartile.median_KMB).length * 7),
            chart.getYAxisPosition(this.modelData.quartile.median) + 3,
            null,
            labelHeight,
            'bold'
        );

        if(this.printSettings == null) {
            xPos = 10;
        } else {
            xPos = 45;
        }
        let xPosition = (hasClientLimit) ? chart.chart.chartHeight - 20 : chart.chart.chartHeight - 40;
        chart.addChartLabel(
            this.modelData.displayText,
            xPos,
            xPosition,
            '#000000',
            labelHeight,
            null,
            chart.chart.chartWidth - 80
        );

        if(this.printSettings == null) {
            chart.addChartImage(
                '../assets/images/advisen-logo.png',
                chart.chart.chartWidth - 80,
                chart.chart.chartHeight - 20,
                69,
                17
            );
        }
    }
    constructor(private benchmarkService: BenchmarkService, 
                    private searchService: SearchService) {
    }

    ngOnInit() {
        this.getBenchmarkRateData();
        this.getCompanyName();
    }

    getCompanyName() {
        if (this.searchService.searchCriteria &&
            this.searchService.searchCriteria.type &&
            this.searchService.searchCriteria.type !== 'SEARCH_BY_MANUAL_INPUT' &&
            this.searchService.selectedCompany && 
            this.searchService.selectedCompany.companyName) {
            this.companyName = this.searchService.selectedCompany.companyName;
        } else if (this.searchService.searchCriteria && this.searchService.searchCriteria.value) {
            this.companyName = this.searchService.searchCriteria.value;
        }

        if(this.companyName && this.companyName.length > 30) {
            this.companyName = this.companyName.substring(0, 30) + '...';
        }
    }

    ordinalSuffix(i) {
        var j = i % 10,
            k = i % 100;
        if(i == 0) {
            return i;
        }
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }

    /**
     * Get Benchmark Rate Data from back end nodejs server
     */
    getBenchmarkRateData() {
        if(this.componentData) {
            if(this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getRatePerMillion(this.componentData.companyId, this.componentData.premiumValue, this.componentData.limitValue, null, null)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getRatePerMillion(null, this.componentData.premiumValue, this.componentData.limitValue, this.componentData.revenueRange, this.componentData.naics)
                .subscribe(modelData => this.setModelData(modelData));
            }      
        }
    }

}
