import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FADE_ANIMATION } from 'app/shared/animations/animations';
import { MenuService } from 'app/services/services';

@Component({
    selector: 'app-no-access',
    templateUrl: './no-access.component.html',
    styleUrls: ['./no-access.component.scss'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class NoAccessComponent implements OnInit {

    constructor( private router: Router, private menuService: MenuService) { }

    ngOnInit() { 
        this.menuService.breadCrumb = 'No Access';
    }
}
