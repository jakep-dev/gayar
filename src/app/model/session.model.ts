import { ResponseModel } from './response.model';
import { PermissionModel, DashboardPermissionModel, BenchmarkPermissionModel } from './permission.model';

export interface SessionModel{
    userId: number;
    loginName: string;
    token: string;
    fullName: string;
    permission: {
      companySearch: PermissionModel,
      dashboard: DashboardPermissionModel,
      frequency: PermissionModel,
      benchmark: BenchmarkPermissionModel
    }
}

export interface SessionResponseModel {
    userinfo: SessionModel,
    resp: ResponseModel
}
