import { trigger, state, style, transition, animate, keyframes  } from '@angular/animations';



export const FADE_ANIMATION = [
    trigger('routerTransition', [
        transition(':enter', [
            style({ opacity: 0 }),
            animate('.2s', style({ opacity: 1 }))
        ]),
    ])
];

export const SLIDE_ANIMATION = [
    trigger('routerTransition', [
        state('*', style({
           
        })),
        transition(':enter', [

           
        ]),
        transition(':leave', [
           
        ])
    ])
];

