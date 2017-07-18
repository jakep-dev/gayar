import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from '../shared/animations/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [FADE_ANIMATION],
  host: { '[@routerTransition]': '' }
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit() {
  }

}
