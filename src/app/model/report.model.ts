import { BasePage } from 'app/pdf-download/pages/base.page';

export interface IReportTileModel {
    id: string;
    description: string;
    value: boolean;
    hasAccess: boolean;
    subComponents: Array<ISubComponentModel>;
}

export interface ISubComponentModel {
    description: string;
    id: string;
    value: boolean;
    pageType: string,
    hasAccess: boolean;
    chartComponents: Array<IChartWidget>;
    subSubComponents: Array<ISubSubComponentModel>;
}

export interface ISubSubComponentModel {
    description: string;
    id: string;
    value: boolean;
    pageType: string,
    hasAccess: boolean;
    chartComponents: Array<IChartWidget>
}

export interface IChartWidget {
    componentName: string,
    pagePosition: number,
    id: string,
    hasAccess: boolean,
    drillDownName: string
}

export interface IChartMetaData {
    chartSetting: IChartWidget,
    imageIndex: string,
    targetPage: BasePage,
    pagePosition: number,
    tocDescription: string,
    imageData: string
}
