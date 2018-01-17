import { Injectable } from '@angular/core';
import { PdfDownloadComponent } from 'app/pdf-download/pdf-download.component';
import { IReportTileModel, FrequencyDataModel, SeverityDataModel } from 'app/model/model';

@Injectable()
export class MenuService {
    isFullScreen: boolean;
    breadCrumb: string;
    containerBgColor: string;
    appTileComponents: Array<any>;

    private pdfDownloader: PdfDownloadComponent;

    public setPdfDownloader(pdfDownloader: PdfDownloadComponent) {
      this.pdfDownloader = pdfDownloader;
    }

    public startPdfDownload(reportSelections: Array<IReportTileModel>, frequencyPeerGroupTable: FrequencyDataModel[], frequencyCompanyLossesTable: FrequencyDataModel[], severityPeerGroupTable: SeverityDataModel[], severityCompanyLossesTable: SeverityDataModel[]) {
      if(this.pdfDownloader) {
        this.pdfDownloader.buildPdf(reportSelections, frequencyPeerGroupTable, frequencyCompanyLossesTable, severityPeerGroupTable, severityCompanyLossesTable);
      }
    }
    constructor() {
      this.appTileComponents = new Array<any>();
    }
}
