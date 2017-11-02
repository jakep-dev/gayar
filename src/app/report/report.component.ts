import { Component, OnInit } from '@angular/core';
import { MenuService, ReportService } from 'app/services/services';
import { ReportModel } from 'app/model/model';

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  /**
   * Each component will have the model.  
   */
  public model: ReportModel = new ReportModel();

  constructor(private menuService: MenuService,
              private reportService: ReportService) {
  }

  ngOnInit() {
    this.menuService.breadCrumb = 'Report';
  }

  onReport () {
    console.log(this.model);
  }
}
