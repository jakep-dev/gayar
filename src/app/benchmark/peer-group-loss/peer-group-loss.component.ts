import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkLimitModel, BoxPlotChartData, BenchmarkLimitAdequacyInput } from 'app/model/model';
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

    /**
     * Event handler to indicate the construction of the BoxPlotChart's required data is built 
     * @param newChartData BoxPlotChart's required data
     */
    onDataComplete(newChartData : BoxPlotChartData) {
        this.chartData = newChartData;
    }

    private chartComponent = new BehaviorSubject<BaseChart>(null);
    chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();

    /**
     * Event handler to indicate the chart is loaded 
     * @param chart The chart commponent
     */
    onChartReDraw(chart: BaseChart) {
        //this.chartComponent = chart;
        this.chartComponent.next(chart);
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
