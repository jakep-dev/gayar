import { ResponseModel } from './response.model';
import { PermissionModel, DashboardPermissionModel, BenchmarkPermissionModel, FrequencyPermissionModel, SeverityPermissionModel } from './permission.model';

export interface SessionModel{
    userId: number;
    loginName: string;
    token: string;
    fullName: string;
    permission: {
      companySearch: PermissionModel,
      dashboard: DashboardPermissionModel,
      frequency: FrequencyPermissionModel,
      severity: SeverityPermissionModel,
      benchmark: BenchmarkPermissionModel,
      glossary: PermissionModel,
      report: PermissionModel,
      underWritingFramework: PermissionModel
    }
}

export interface SessionResponseModel {
    userinfo: SessionModel,
    resp: ResponseModel
}
