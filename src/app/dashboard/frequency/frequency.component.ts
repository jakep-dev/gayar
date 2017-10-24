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
        chart.removeRenderedObjects();
        this.addLabelAndImage(chart);
        this.chartComponent.next(chart);
    }

    addLabelAndImage(chart){
        chart.addChartLabel(
            this.modelData.displayText,
            (chart.chart.chartWidth * 0.1) - 2,
            chart.chart.chartHeight - 80,
            '#000000',
            10,
            null,
            (chart.chart.chartWidth * 0.75) + 35
        );

        chart.addChartImage(
            'https://www.advisen.com/img/advisen-logo.png', 
            chart.chart.chartWidth - 80, 
            chart.chart.chartHeight - 20, 
            69, 
            17
        ); 
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
