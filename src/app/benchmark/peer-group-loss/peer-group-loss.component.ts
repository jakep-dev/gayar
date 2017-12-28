import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkLimitModel, BoxPlotChartData, BenchmarkLimitAdequacyInput, ComponentPrintSettings } from 'app/model/model';
import { BenchmarkService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
  selector: 'app-peer-group-loss',
  templateUrl: './peer-group-loss.component.html',
  styleUrls: ['./peer-group-loss.component.scss']
})
export class PeerGroupLossComponent implements OnInit {

    chartHeader:string = '';
    modelData: BenchmarkLimitModel;

    setModelData(modelData: BenchmarkLimitModel) {
        this.modelData = modelData;
        this.chartHeader = this.modelData.chartTitle;
    }

    chartData: BoxPlotChartData;

    @Input() componentData: BenchmarkLimitAdequacyInput;

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
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
        if(!this.isFirstRedrawComplete.getValue()) {
            this.isFirstRedrawComplete.next(true);
        }
    }

    addLabelAndImage(chart){
        let xPos: number;
        if(this.printSettings == null) {
            xPos = 10;
        } else {
            xPos = 45;
        }
        chart.addChartLabel(
            chart.chartData.displayText, 
            xPos, 
            chart.chart.chartHeight - 70, 
            '#000000',
            10,
            null,
            chart.chart.chartWidth - 73
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

    constructor(private benchmarkService: BenchmarkService) {
    }

    ngOnInit() {
        this.getBenchmarkPeerGroupLossData();
    }

    /**
     * Get Benchmark Peer Group Loss Data from back end nodejs server
     */
    getBenchmarkPeerGroupLossData() {
        if(this.componentData) {
            if(this.componentData.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getLimitAdequacy(this.componentData.companyId, this.componentData.limits)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getLimitAdequacyChartByManualInput(this.componentData.limits, this.componentData.naics, this.componentData.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }
        }
    }

}
