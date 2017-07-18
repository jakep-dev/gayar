import { trigger, state, style, transition, animate, keyframes  } from '@angular/animations';



export const ACCORDION_ANIMATION = [
    trigger('arrowAnimation', [
      state('down', style({
        'transform': 'rotate(180deg)'
      })),
      state('up', style({
        'transform': 'rotate(360deg)'
      })),
      transition('void => *', animate('0.2s 100ms ease-out')),
    ])
];


export const SPLIT_ANIMATION = [];

export const FLIP_ANIMATION = [];