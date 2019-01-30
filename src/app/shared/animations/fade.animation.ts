import { animate, style, transition, trigger } from '@angular/animations';


export const fadeStateTrigger = trigger('fade', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(1000)
  ]),
  transition(':leave', animate(1000, style({
    opacity: 0
  })))
]);
