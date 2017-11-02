import { Component, OnInit } from '@angular/core';
import { MenuService, ReportService } from 'app/services/services';
import { SubComponent, IReportModel, IBenchmarkReportModel } from 'app/model/model';

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  model: IReportModel;

  frequencyTypeOfIncidentSubComponents: Array<SubComponent> = this.buildTypeOfIncident();
  frequencyTypeOfLossSubComponents: Array<SubComponent> = this.buildTypeOfLoss();

  severityTypeOfIncidentSubComponents: Array<SubComponent> = this.buildTypeOfIncident();
  severityTypeOfLossSubComponents: Array<SubComponent> = this.buildTypeOfLoss();


  constructor(private menuService: MenuService,
              private reportService: ReportService) {

  }

  ngOnInit() {
    this.initializeModel();
    this.menuService.breadCrumb = 'Report';
  }

  initializeModel () {
    this.model = {
      reportId: '',
      isDashboard: false,
      isBenchmark: false,
      isFrequency: false,
      isSeverity: false,
      isAppendix: false,
      benchmark: {
        isLimitAdequacy: false,
        isLimitDistribution: false,
        isPremiumDistribution: false,
        isRatePerMillionDistributionByValues: false,
        isRetentionDistribution: false
      },
      dashboard: {
        isSeverity: false,
        isFrequency: false,
        isBenchmark: false
      }
    };
  }

  /**
   * buildTypeOfIncident - Build the type of indicents sub components for frequency and severity.
   *
   * @returns {type}  Array<SubComponent>
   */
  buildTypeOfIncident (): Array<SubComponent> {
    let typeOfIncidents: Array<SubComponent> = new Array<SubComponent>();
    typeOfIncidents.push({
      name: 'Data Privacy',
      key: 'Data_Privacy',
      value: false
    });
    typeOfIncidents.push({
      name: 'Network Security',
      key: 'Network_Security',
      value: false
    });
    typeOfIncidents.push({
      name: 'Tech E&O',
      key: 'Tech_EO',
      value: false
    });
    typeOfIncidents.push({
      name: 'Privacy Violation',
      key: 'Privacy_Violation',
      value: false
    });
    return typeOfIncidents;
  }


  /**
   * buildTypeOfLoss - Build the type of loss sub components for frequency and severity.
   *
   * @returns {type}  Array<SubComponent>
   */
  buildTypeOfLoss (): Array<SubComponent> {
    let typeOfLosses: Array<SubComponent> = new Array<SubComponent>();
    typeOfLosses.push({
      name: 'Personal Information',
      key: 'Personal_Information',
      value: false
    });
    typeOfLosses.push({
      name: 'Corporate Losses',
      key: 'Corporate_Losses',
      value: false
    });
    return typeOfLosses;
  }


  /**
   * onFrequencyTileSelectionChange - Fires on frequency tile selection.
   *
   * @param  {type} val - true or false based on selection.
   */
  onFrequencyTileSelectionChange (val) {
    this.model.isFrequency = val;
    ////this.model.isFrequency = val;
    //this.model.frequency.isIndustryOverview = val;
    //this.model.frequency.isTimePeriod = val;
    //this.model.frequency.isMost5RecentCases = val;
    //this.model.frequency.typeofIncident.isDataPrivacy = val;
    //this.model.frequency.typeofIncident.isNetworkSecurity = val;
    //this.model.frequency.typeofIncident.isTechEAndO = val;
    //this.model.frequency.typeofIncident.isPrivacyViolation = val;
    //this.model.frequency.typeofLoss.isCorporateLosses = val;
    //this.model.frequency.typeofLoss.isPersonalInformation = val;
  }


  /**
   * onBenchmarkTileSelectionChange - Fires on benchmark tile selection.
   *
   * @param  {type} val description - true of false based on selection.
   */
  onBenchmarkTileSelectionChange (val) {
    this.model.isBenchmark = val;
    this.model.benchmark.isLimitAdequacy = val;
    this.model.benchmark.isPremiumDistribution = val;
    this.model.benchmark.isLimitDistribution = val;
    this.model.benchmark.isRetentionDistribution = val;
    this.model.benchmark.isRatePerMillionDistributionByValues = val;
  }

  /**
   * onBenchmarkTileSelectionChange - Fires on severity tile selection.
   *
   * @param  {type} val description - true of false based on selection.
   */
  onSeverityTileSelectionChange (val) {
    this.model.isSeverity = val;
    //this.model.severity.isIndustryOverview = val;
    //this.model.severity.isTimePeriod = val;
    //this.model.severity.isTop5Cases = val;
    //this.model.severity.typeOfIncident.isDataPrivacy = val;
    //this.model.severity.typeOfIncident.isNetworkSecurity = val;
    //this.model.severity.typeOfIncident.isTechEAndO = val;
    //this.model.severity.typeOfIncident.isPrivacyViolation = val;
    //this.model.severity.typeOfLoss.isCorporateLosses = val;
    //this.model.severity.typeOfLoss.isPersonalInformation = val;
  }

  onReport () {
    console.log(this.model);
  }
}
