import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkLimitModel, BoxPlotChartData, BenchmarkLimitAdequacyInput } from 'app/model/model';
import { BenchmarkService } from '../../services/services';

@Component({
  selector: 'app-peer-group-loss',
  templateUrl: './peer-group-loss.component.html',
  styleUrls: ['./peer-group-loss.component.scss']
})
export class PeerGroupLossComponent implements OnInit {

    searchParms: BenchmarkLimitAdequacyInput;

    modelData: BenchmarkLimitModel;

    setModelData(modelData: BenchmarkLimitModel) {
        this.modelData = modelData;
    }

    private chartData: BehaviorSubject<BoxPlotChartData>;
    chartData$: Observable<BoxPlotChartData>;

    @Input() set componentData(data: BenchmarkLimitAdequacyInput) {
        if(data) {
            this.searchParms = data;
            if(data.searchType !== 'SEARCH_BY_MANUAL_INPUT') {
                this.benchmarkService.getLimitAdequacy(data.companyId, data.limits)
                .subscribe(modelData => this.setModelData(modelData));
            } else {
                this.benchmarkService.getLimitAdequacyChartByManualInput(data.limits, data.naics, data.revenueRange)
                .subscribe(modelData => this.setModelData(modelData));
            }
        }
    }

    onDataComplete(newChartData : BoxPlotChartData) {
        this.chartData.next(newChartData);
    }

    private chartObject: BehaviorSubject<any>;
    
    chartObject$: Observable<any>;
    
    onChartReDraw(chartObject: any) {
        this.chartObject.next(
            {
                isObjectValid: true,
                highChartObject: chartObject
            }
        );
    }

    constructor(private benchmarkService: BenchmarkService) {
        this.chartData = new BehaviorSubject<BoxPlotChartData>(
            {
                categories: [],
                series: [],
                subtitle: '',
                title: '',
                displayText: '',
                xAxisFormatter: null,
                xAxisLabel: '',
                yAxisLabel: '',
                customChartSettings: null,
                hasRedrawActions: false
            }
        );
        this.chartData$ = this.chartData.asObservable();
        this.chartObject = new BehaviorSubject<any>(
            {
                isObjectValid: false,
                highChartObject: null
            }
        );
        this.chartObject$ = this.chartObject.asObservable();
    }

    ngOnInit() {}

}
