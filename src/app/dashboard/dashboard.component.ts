import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION} from '../shared/animations/animations';
import { SearchService } from '../services/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [FADE_ANIMATION],
  host: { '[@routerTransition]': '' }
})
export class DashboardComponent implements OnInit {

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    
  }
}
