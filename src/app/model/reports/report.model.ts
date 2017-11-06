import { SubComponentModel } from './subcomponent.model';

let instance = null;
export class ReportModel {
  constructor() {
    if(!instance){
      instance = this;
    }
    this.initialize();
    return instance;
  }

  reportId: string;
  isDashboard: boolean;
  isBenchmark: boolean;
  isFrequency: boolean;
  isSeverity: boolean;
  isAppendix: boolean;

  dashboardComponents: Array<SubComponentModel>;
  frequencyComponents: Array<SubComponentModel>;
  severityComponents: Array<SubComponentModel>;
  appendixComponents: Array<SubComponentModel>;
  benchmarkComponents: Array<SubComponentModel>;

  private initialize () {
    this.dashboardComponents = new Array<SubComponentModel>();
    this.frequencyComponents = new Array<SubComponentModel>();
    this.severityComponents = new Array<SubComponentModel>();
    this.appendixComponents = new Array<SubComponentModel>();
    this.benchmarkComponents = new Array<SubComponentModel>();
  }
}
