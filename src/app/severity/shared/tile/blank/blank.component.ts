import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from 'app/services/services';

@Component({
  selector: 'blank-tile',
  templateUrl: './blank.component.html',
})
export class BlankComponent implements OnInit {
  constructor(private menuService: MenuService) {  }
  @Input() id: string;
  isTileVisible: boolean = true;

  ngOnInit() {
    this.menuService.appTileComponents.push(this);
  }
}
