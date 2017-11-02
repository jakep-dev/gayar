export interface IReportModel {
    reportId: string;
    isDashboard: boolean;
    isBenchmark: boolean;
    isFrequency: boolean;
    isSeverity: boolean;
    isAppendix: boolean;
    benchmark: IBenchmarkReportModel;
    // severity: ISeverityReportModel;
    // frequency: IFrequencyReportModel;
}

export interface SubComponent {
    name: string;
    key: string;
    value: boolean
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
  isTop5Cases: boolean;
}


/**
 * Frequency model for the report
 */
export interface IFrequencyReportModel {
  isIndustryOverview: boolean;
  isTimePeriod: boolean;
  typeofIncident: ITypeOfIncidentReportModel;
  typeofLoss: ITypeOfLossReportModel;
  isMost5RecentCases: boolean;
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
