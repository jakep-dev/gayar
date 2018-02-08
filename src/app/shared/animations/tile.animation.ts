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


/**
 * Split animation on tile content.
 */
export const SPLIT_ANIMATION = [
   trigger('splitter', [
     state('0', style({
       height: 'auto'
     })),
     state('1', style({
        height: 'auto'
     })),
     transition('0 => 1', animate('300ms')),
     transition('1 => 0', animate('300ms'))
   ])
];

export const FLYINOUT_ANIMATION = [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
]


/**
 * Flip animation on tile content.
 */
export const FLIP_ANIMATION = [
  trigger('flipper', [
    state('0', style({transform: 'rotateY(0deg)'})),
    state('1', style({transform: 'rotateY(180deg)'})),
    transition('0 => 1', animate('300ms')),
    transition('1 => 0', animate('300ms'))
  ])
];
