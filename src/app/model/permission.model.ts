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

export interface FrequencyPermissionModel {
  hasAccess: boolean;
  industry: {
    hasAccess: boolean
  };
  timePeriod: {
    hasAccess: boolean,
    hasDetailAccess: boolean
  };
  incident: {
    hasAccess: boolean,
    hasDetailAccess: boolean
  };
  loss : {
    hasAccess: boolean,
    hasDetailAccess: boolean
  };
  peerGroupTable: {
    hasAccess: boolean,
    hasDescriptionAccess: boolean
  };
  companyTable: {
    hasAccess: boolean,
    hasDescriptionAccess: boolean
  }
}

export interface SeverityPermissionModel {
  hasAccess: boolean;
  industry: {
    hasAccess: boolean
  };
  timePeriod: {
    hasAccess: boolean,
    hasDetailAccess: boolean
  };
  incident: {
    hasAccess: boolean,
    hasDetailAccess: boolean
  };
  loss : {
    hasAccess: boolean,
    hasDetailAccess: boolean
  };
  peerGroupTable: {
    hasAccess: boolean,
    hasDescriptionAccess: boolean
  };
  companyTable: {
    hasAccess: boolean,
    hasDescriptionAccess: boolean
  }
}