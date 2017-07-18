import { trigger, state, style, transition, animate, keyframes  } from '@angular/animations';



export const ACCORDION_ANIMATION = [
    trigger('accordionAnimation', [
      state('down', style({
        transform: 'rotate(-180deg)'
      })),
      state('up', style({
        transform: 'rotate(-360deg)'
      })),
      transition('down => up', animate('200ms')),
      transition('up => down', animate('200ms'))
    ]),
    trigger('accordionContentAnimation', [
      state('down', style({
        height: '0px',
        minHeight: '0px',
        padding: '0px',
      })),
      state('up', style({
        height: 'auto',
        minHeight: '20px',
        padding: '4px'
      })),
      transition('down => up', animate('200ms')),
      transition('up => down', animate('200ms'))
    ])
];


export const SPLIT_ANIMATION = [
   trigger('splitAnimation', [
     state('split', style({
        height: 'auto'
     })),
     state('combine', style({
        height: 'auto'
     })),
     transition('split => combine', animate('200ms')),
      transition('combine => split', animate('200ms'))
   ])
];

export const FLIP_ANIMATION = [
  trigger('flipAnimation', [
     state('back', style({

     })),
     state('front', style({

     })),
     transition('* => *', animate('0.2s 100ms ease-out'))
   ])
];