import { BasePage } from 'app/pdf-download/pages/base.page';

export interface IReportTileModel {
    id: string;
    description: string;
    value: boolean;
    subComponents: Array<ISubComponentModel>;
}

export interface ISubComponentModel {
    description: string;
    id: string;
    value: boolean;
    pageType: string,
    chartComponents: Array<IChartWidget>,
    subSubComponents: Array<ISubSubComponentModel>;
}

export interface ISubSubComponentModel {
    description: string;
    id: string;
    value: boolean;
    pageType: string,
    chartComponents: Array<IChartWidget>
}

export interface IChartWidget {
    componentName: string,
    pagePosition: number,
    viewName: string,
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
