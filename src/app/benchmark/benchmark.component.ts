import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from '../shared/animations/animations';
import { SearchService } from '../services/services';
import { BenchmarkPremiumDistributionInput } from '../model/benchmark.model';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss'],
  animations: [FADE_ANIMATION],
  host: { '[@routerTransition]': '' }
})
export class BenchmarkComponent implements OnInit {

  public companyId: number;
  public clientValue: number;
  public naics: number;
  public revenueRange: string;

  public benchmarkPremiumDistributionInput: BenchmarkPremiumDistributionInput;


  constructor(private searchService: SearchService) { }

  ngOnInit() {
       this.companyId = this.searchService.companyId;
       this.clientValue = this.searchService.clientValue;
       this.naics = this.searchService.naics;
       this.revenueRange = this.searchService.revenueRange;

        this.benchmarkPremiumDistributionInput = {
          companyId: this.companyId,
          chartType: 'PREMIUM',
          clientValue: this.clientValue,
          naics: this.naics,
          revenueRange: this.revenueRange
        }
  }

}
