import { Component, OnInit, Input } from '@angular/core';
import { BenchmarkModel, ChartData, BenchmarkPremiumDistributionInput } from 'app/model/model';

@Component({
  selector: 'app-limit',
  templateUrl: './limit.component.html',
  styleUrls: ['./limit.component.css']
})
export class LimitComponent implements OnInit {
  
  @Input() componentData: BenchmarkPremiumDistributionInput;
  chartData: ChartData;

  constructor() { }

  ngOnInit() { }

  getChartData($event) {
    console.log('LIMIT getChartOptions', $event);
    this.chartData = $event;
  }

}
