import { ResponseModel } from './response.model';
import { PermissionModel } from './permission.model';

export interface SessionModel{
    userId: number;
    loginName: string;
    token: string;
    fullName: string;
    permission: {
      companySearch: PermissionModel,
      dashboard: PermissionModel,
      frequency: PermissionModel
    }
}

export interface SessionResponseModel {
    userinfo: SessionModel,
    resp: ResponseModel
}
