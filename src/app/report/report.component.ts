import { Component, OnInit } from '@angular/core';
import { MenuService, ReportService } from 'app/services/services';
import { IReportTileModel } from 'app/model/model';

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reportTileModel: Array<IReportTileModel> = null;

  constructor(private menuService: MenuService,
              private reportService: ReportService) {

  }

  ngOnInit() {
    this.menuService.breadCrumb = 'Report';
    this.getReportConfig();
  }

  /**
   * getReportConfig - Load the report configuration.
   *
   * @return {} - No return types.
   */
  getReportConfig () {
    this.reportService.getReportConfig().subscribe((data)=> {
      this.reportTileModel = data;
      console.log(this.reportTileModel[0].subComponents)
    });
  }

  onReport () {
    console.log(this.reportTileModel);
  }
}
