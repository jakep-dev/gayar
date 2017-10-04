import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { BenchmarkScoreModel, GaugeChartData, BenchmarkScore } from 'app/model/model';
import { DashboardService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';

@Component({
  selector: 'app-dashboard-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {

  
  chartHeader:string = '';
  modelData: BenchmarkScoreModel;

  setModelData(modelData: BenchmarkScoreModel) {
      this.modelData = modelData;
      this.chartHeader = this.modelData.chartTitle;
  }

  chartData: GaugeChartData;

  @Input() componentData: BenchmarkScore;

  /**
   * Event handler to indicate the construction of the GaugeChart's required data is built 
   * @param newChartData GaugeChart's required data
   */
  onDataComplete(newChartData : GaugeChartData) {
      this.chartData = newChartData;
  }

  private chartComponent = new BehaviorSubject<BaseChart>(null);
  chartComponent$: Observable<BaseChart> = this.chartComponent.asObservable();
  
  /**
   * Event handler to indicate the chart is loaded 
   * @param chart The chart commponent
   */
  onChartReDraw(chart: BaseChart) {     
      this.chartComponent.next(chart);
  }
  
  constructor(private dashboardService: DashboardService) {
  }

  ngOnInit() {
      this.getFrequencyData();
  }

  /**
   * Get Benchmark Data from back end nodejs server
   */
  getFrequencyData() {   
    this.dashboardService.getFrequencyScore(this.componentData.companyId, this.componentData.naics, 
                                            this.componentData.revenueRange, this.componentData.limit, this.componentData.retention).
                                            subscribe(chartData => this.setModelData(chartData));;
  }        
}
