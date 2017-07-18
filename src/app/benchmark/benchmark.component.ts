import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from '../shared/animations/animations';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css'],
  animations: [FADE_ANIMATION],
  host: { '[@routerTransition]': '' }
})
export class BenchmarkComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
