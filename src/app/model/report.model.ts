export interface IReportTileModel {
    id: string;
    description: string;
    value: boolean;
    subComponents: Array<ISubComponentModel>;
}

export interface ISubComponentModel {
    description: string;
    id: string;
    value: boolean
}
