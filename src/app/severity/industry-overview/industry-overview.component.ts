import { Component, OnInit, Input } from '@angular/core';
import { SeverityIndustryOverviewModel } from 'app/model/severity.model';
import { BarChartData, SeverityInput, ComponentPrintSettings } from 'app/model/model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { BaseChart } from 'app/shared/charts/base-chart';
import { Observable } from 'rxjs/Observable';
import { SeverityService, SessionService } from 'app/services/services';

@Component({
  selector: 'severity-industry-overview',
  templateUrl: './industry-overview.component.html',
  styleUrls: ['./industry-overview.component.css']
})
export class IndustryOverviewComponent implements OnInit {

  modelData: SeverityIndustryOverviewModel;
  chartHeader : string;
  hasAccess: boolean;

  setModelData(modelData: SeverityIndustryOverviewModel) {
      this.modelData = modelData;
      this.chartHeader = modelData.chartTitle;
  }

  chartData: BarChartData;

  @Input() componentData: SeverityInput;

  @Input() printSettings: ComponentPrintSettings;

  /**
   * Event handler to indicate the construction of the BarChart's required data is built 
   * @param newChartData BarChart's required data
   */
  onDataComplete(newChartData : BarChartData) {
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
        if(this.modelData.datasets && this.modelData.datasets.length > 0) {
            if(this.modelData.displayText && this.modelData.displayText.length > 0) { 
                let labelHeight = (Math.ceil((this.modelData.displayText.length * 5) / (chart.chart.chartWidth - 85))) * 10;
                chart.addChartLabel(
                    this.modelData.displayText,
                    xPos,
                    chart.chart.chartHeight - labelHeight,
                    '#000000',
                    10,
                    null,
                    chart.chart.chartWidth - 85
                );             
            }
        }
        if(this.printSettings == null) {
            chart.addChartImage(
                '../assets/images/advisen-logo.png',
                chart.chart.chartWidth - 80,
                chart.chart.chartHeight - 20,
                69,
                17
            );
        }
        let  yBreakPoint = chart.getYAxisPosition(0);
        chart.addLine([chart.chart.plotLeft - 5, yBreakPoint], [chart.chart.plotLeft + 5, yBreakPoint + 10], '#ccd6eb', 2);
        chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 5], [chart.chart.plotLeft + 5, yBreakPoint + 5], '#FFFFFF', 5.5);
        chart.addLine([chart.chart.plotLeft - 5, yBreakPoint - 10], [chart.chart.plotLeft + 5, yBreakPoint], '#ccd6eb', 2);
    }

  constructor(private severityService: SeverityService, private sessionService: SessionService) {
  }

  ngOnInit() {
      this.getFrequencyIndustryOverViewData();
      this.getPermission();
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

  getPermission() {
      let permission = this.sessionService.getUserPermission();
      if(permission) {
          this.hasAccess = permission.severity && permission.severity.industry && permission.severity.industry.hasAccess
      }
  }

}
