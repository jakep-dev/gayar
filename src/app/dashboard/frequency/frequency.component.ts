import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { DashboardScoreModel, GaugeChartData, DashboardScore, ComponentPrintSettings } from 'app/model/model';
import { DashboardService, SessionService } from '../../services/services';
import { BaseChart } from './../../shared/charts/base-chart';
import { SearchService } from 'app/services/search.service';
import { SnackBarService } from 'app/shared/shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-frequency',
  templateUrl: './frequency.component.html',
  styleUrls: ['./frequency.component.css']
})
export class FrequencyComponent implements OnInit {

  
  chartHeader:string = '';
  modelData: DashboardScoreModel;
  permission: any;
  isDisabled: boolean = false;

  setModelData(modelData: DashboardScoreModel) {
      this.modelData = modelData;
      this.chartHeader = this.modelData.chartTitle;
      if(this.searchService.checkValidationPeerGroup()){
            if(!this.searchService.checkValidationPeerGroup().hasFrequencyData){
                this.modelData.score.finalScore = null;
                this.modelData.displayText = null;
            }

      }
  }

  chartData: GaugeChartData;

  @Input() componentData: DashboardScore;

  @Input() printSettings: ComponentPrintSettings;

  /**
   * Event handler to indicate the construction of the GaugeChart's required data is built 
   * @param newChartData GaugeChart's required data
   */
  onDataComplete(newChartData : GaugeChartData) {
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

  navigate () {
    if (this.searchService.checkValidationPeerGroup() && 
        this.searchService.checkValidationPeerGroup().hasFrequencyData &&
        this.permission && this.permission.frequency && this.permission.frequency.hasAccess) {
        this.router.navigate(['/frequency']);
    } else {
        this.snackBarService.Simple('No Access');
    }
  }

    addLabelAndImage(chart: BaseChart){
        chart.addChartLabel(
            this.modelData.displayText,
            (chart.chart.chartWidth * 0.1) - 2,
            chart.chart.chartHeight - 80,
            '#000000',
            10,
            null,
            (chart.chart.chartWidth * 0.75) + 35
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
  
  constructor(private dashboardService: DashboardService,
              private searchService : SearchService,
              private sessionService: SessionService,
              private snackBarService: SnackBarService,
              private router: Router) {
  }

  ngOnInit() {
      this.getFrequencyData();
      this.getPermission();
  }

  /**
   * Get Benchmark Data from back end nodejs server
   */
  getFrequencyData() {   
    this.dashboardService.getFrequencyScore(this.componentData.companyId, this.componentData.naics, 
                                            this.componentData.revenueRange, this.componentData.limit, this.componentData.retention).
                                            subscribe(chartData => this.setModelData(chartData));;
  }
  
  getPermission() {
    this.permission = this.sessionService.getUserPermission();
    if (this.permission && this.permission.dashboard && this.permission.dashboard.frequencyGauge) {
        this.isDisabled = !this.permission.dashboard.frequencyGauge.hasAccess;
    }
   }
}
