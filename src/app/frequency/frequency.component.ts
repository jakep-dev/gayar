import { Component, OnInit } from '@angular/core';
import { FADE_ANIMATION } from '../shared/animations/animations';

@Component({
    selector: 'app-frequency',
    templateUrl: './frequency.component.html',
    styleUrls: ['./frequency.component.css'],
    animations: [FADE_ANIMATION],
    host: { '[@routerTransition]': '' }
})
export class FrequencyComponent implements OnInit {

    constructor() { }

    ngOnInit() { }

}
