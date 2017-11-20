import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkModel, BarChartData, BenchmarkDistributionInput } from 'app/model/model';
import { BenchmarkService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
	selector: 'app-premium',
	templateUrl: './premium.component.html',
	styleUrls: ['./premium.component.scss']
})
export class PremiumComponent implements OnInit {

    chartHeader:string = '';
    modelData: BenchmarkModel;

    static maxCharactersPerLine: number = 105;

    setModelData(modelData: BenchmarkModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: BarChartData;

    @Input() componentData: BenchmarkDistributionInput;

    /**
     * Event handler to indicate the construction of the BarChart's required data is built 
     * @param newChartData BarChart's required data
     */
    onDataComplete(newChartData : BarChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
    
    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        chart.removeRenderedObjects();
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
    }

    addLabelAndImage(chart){
        let labelHeight = ((Math.ceil(chart.chartData.displayText.length / PremiumComponent.maxCharactersPerLine)) * 10);
        chart.addChartLabel(
            chart.chartData.displayText,
            10,
            chart.chart.chartHeight - labelHeight,
            '#000000',
            10,
            null,
            chart.chart.chartWidth - 85
        );
        chart.addChartImage(
            '../assets/images/advisen-logo.png',
            chart.chart.chartWidth - 80,
            chart.chart.chartHeight - 20,
            69,
            17
        );
    }
    
    constructor(private benchmarkService: BenchmarkService) {
    }

    ngOnInit() {
        this.getBenchmarkPremiumData();
    }

    /**
     * Get Benchmark Premium Data from back end nodejs server
     */
    getBenchmarkPremiumData() {
        if(this.componentData) {
            if(this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getBenchmarkPremiumByCompanyId(this.componentData.premiumValue, 'PREMIUM', this.componentData.companyId)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getBenchmarkPremiumByManualInput(this.componentData.premiumValue, 'PREMIUM', this.componentData.naics, this.componentData.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }
        }
    }
    
}
