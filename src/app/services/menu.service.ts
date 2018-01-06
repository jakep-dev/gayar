import { Injectable } from '@angular/core';
import { PdfDownloadComponent } from 'app/pdf-download/pdf-download.component';
import { IReportTileModel } from 'app/model/model';

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

    public startPdfDownload(reportSelections: Array<IReportTileModel>) {
      if(this.pdfDownloader) {
        this.pdfDownloader.buildPdf(reportSelections);
      }
    }
    constructor() {
      this.appTileComponents = new Array<any>();
    }
}
