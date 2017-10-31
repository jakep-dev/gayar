export interface IReportModel {
    reportId: string;
    isDashboard: boolean;
    benchmark: IBenchmarkReportModel;
    severity: ISeverityReportModel;
    frequency: IFrequencyReportModel;
}

/**
 * Benchmark model for the report
 */
export interface IBenchmarkReportModel {
  isLimitAdequacy: boolean;
  isPremiumDistribution: boolean;
  isLimitDistribution: boolean;
  isRetentionDistribution: boolean;
  isRatePerMillionDistributionByValues: boolean;
}

/**
 * Severity model for the report
 */
export interface ISeverityReportModel {
  isIndustryOverview: boolean;
  isTimePeriod: boolean;
  typeOfIncident: ITypeOfIncidentReportModel;
  typeOfLoss: ITypeOfLossReportModel;
}


/**
 * Frequency model for the report
 */
export interface IFrequencyReportModel {
  isIndustryOverview: boolean;
  isTimePeriod: boolean;
  typeofIncident: ITypeOfIncidentReportModel;
}

export interface ITypeOfIncidentReportModel {
  isDataPrivacy: boolean;
  isNetworkSecurity: boolean;
  isTechEAndO: boolean;
  isPrivacyViolation: boolean;
}

export interface ITypeOfLossReportModel {
  isPersonalInformation: boolean;
  isCorporateLosses: boolean;
}
