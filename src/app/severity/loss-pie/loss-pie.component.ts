import { Component, OnInit, Input } from '@angular/core';
import { SeverityService } from 'app/services/services';
import { SeverityLossPieFlipModel, PieChartData, SeverityInput } from 'app/model/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseChart } from 'app/shared/charts/base-chart';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'severity-loss-pie',
  templateUrl: './loss-pie.component.html',
  styleUrls: ['./loss-pie.component.css']
})
export class LossPieComponent implements OnInit {
  
      chartHeader : string = '';
  
      modelData: SeverityLossPieFlipModel;
  
      setModelData(modelData: SeverityLossPieFlipModel) {
          this.modelData = modelData;
          this.chartHeader = this.modelData.chartTitle;
      }
  
      chartData: PieChartData;
  
      @Input() componentData: SeverityInput;
  
      /**
       * Event handler to indicate the construction of the PieChart's required data is built 
       * @param newChartData PieChart's required data
       */
      onDataComplete(newChartData : PieChartData) {
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
          if(this.modelData.datasets && this.modelData.datasets.length > 0) {
              if(this.modelData.displayText && this.modelData.displayText.length > 0) {
                  let labelHeight = (Math.ceil((this.modelData.displayText.length * 5) / (chart.chart.chartWidth - 85))) * 10;
                  
                  chart.addChartLabel(
                      this.modelData.displayText,
                      10,
                      chart.chart.chartHeight - labelHeight,
                      '#000000',
                      10,
                      null,
                      chart.chart.chartWidth - 85
                  );
              }
          }
  
          chart.addChartImage(
              'https://www.advisen.com/img/advisen-logo.png',
              chart.chart.chartWidth - 80,
              chart.chart.chartHeight - 20,
              69,
              17
          );
      }
      
      constructor(private severityService: SeverityService) {
      }
  
      ngOnInit() {
          this.getSeverityData();
      }
  
      /**
       * Get Severity Data from back end nodejs server
       */
      getSeverityData() {
          if (this.componentData) {
              this.severityService.getSeverityTypeOfLossFlipDetailDataset(this.componentData.companyId, this.componentData.naics, this.componentData.revenueRange)
                  .subscribe(chartData => this.setModelData(chartData));
              }
      }     
  
}
