export interface PermissionModel {
  hasAccess: boolean;
}

export interface DashboardPermissionModel {
  hasAccess : boolean;
  frequencyGauge: {
    hasAccess: boolean
  };
  severityGauge: {
    hasAccess: boolean
  };
  benchmarkGauge: {
    hasAccess:boolean
  };
}

export interface BenchmarkPermissionModel {
  hasAccess : boolean;
  limitAdequacy: {
    hasAccess: boolean
  };
  premium: {
    hasAccess: boolean
  };
  limit: {
    hasAccess:boolean
  };
  retention: {
    hasAccess:boolean
  };
  rate: {
    hasAccess:boolean
  };
}