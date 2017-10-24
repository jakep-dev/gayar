import { Component, OnInit, Input } from '@angular/core';
import { SeverityIndustryOverviewModel } from 'app/model/severity.model';
import { BarChartData, SeverityInput } from 'app/model/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseChart } from 'app/shared/charts/base-chart';
import { Observable } from 'rxjs/Observable';
import { SeverityService } from 'app/services/services';

@Component({
  selector: 'severity-industry-overview',
  templateUrl: './industry-overview.component.html',
  styleUrls: ['./industry-overview.component.css']
})
export class IndustryOverviewComponent implements OnInit {

  modelData: SeverityIndustryOverviewModel;
  chartHeader : string;

  setModelData(modelData: SeverityIndustryOverviewModel) {
      this.modelData = modelData;
      this.chartHeader = modelData.chartTitle;
  }

  chartData: BarChartData;

  @Input() componentData: SeverityInput;

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
      this.getFrequencyIndustryOverViewData();
  }

  /**
   * Get Frequency Industry Overview Data from back end nodejs server
   */
  getFrequencyIndustryOverViewData() {     
      if(this.componentData) {           
        this.severityService.getSeverityIndustryOverview(this.componentData.companyId, this.componentData.naics)
        .subscribe(modelData => this.setModelData(modelData));            
      }
  }

}
