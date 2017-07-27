import { ResponseModel } from './response.model';

export interface SessionModel{
    userId: number;
    loginName: string;
    token: string;
    fullName: string;
}

export interface SessionResponseModel {
    userinfo: SessionModel,
    resp: ResponseModel
}