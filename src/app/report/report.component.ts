import { Component, OnInit } from '@angular/core';
import { MenuService } from 'app/services/services';
import { SubComponent } from 'app/model/report.model';

@Component({
  selector: 'app-report',
  templateUrl: 'report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  frequencyTypeOfIncidentSubComponents: Array<SubComponent> = this.buildTypeOfIncident();
  frequencyTypeOfLossSubComponents: Array<SubComponent> = this.buildTypeOfLoss();

  severityTypeOfIncidentSubComponents: Array<SubComponent> = this.buildTypeOfIncident();
  severityTypeOfLossSubComponents: Array<SubComponent> = this.buildTypeOfLoss();


  constructor(private menuService: MenuService) {  }

  ngOnInit() {
    this.menuService.breadCrumb = 'Report';
  }

  buildFrequencySubComponents () {

  }

  buildSeveritySubComponents () {

  }

  buildBenchmarkSubComponents () {

  }

  buildTypeOfIncident (){
    let typeOfIncidents: Array<SubComponent> = new Array<SubComponent>();
    typeOfIncidents.push({
      name: 'Data Privacy',
      key: 'Data_Privacy',
      value: false
    });
    typeOfIncidents.push({
      name: 'Network Security',
      key: 'Network_Security',
      value: false
    });
    typeOfIncidents.push({
      name: 'Tech E&O',
      key: 'Tech_EO',
      value: false
    });
    typeOfIncidents.push({
      name: 'Privacy Violation',
      key: 'Privacy_Violation',
      value: false
    });
    return typeOfIncidents;
  }

  buildTypeOfLoss () {
    let typeOfLosses: Array<SubComponent> = new Array<SubComponent>();
    typeOfLosses.push({
      name: 'Personal Information',
      key: 'Personal_Information',
      value: false
    });
    typeOfLosses.push({
      name: 'Corporate Losses',
      key: 'Corporate_Losses',
      value: false
    });
    return typeOfLosses;
  }
}
