import {ChangeDetectionStrategy, Component, HostBinding, OnInit} from '@angular/core';
import { fadeStateTrigger } from '@shared/animations/fade.animation';

@Component({
  selector: 'th-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeStateTrigger],
})
export class AuthComponent implements OnInit {

  @HostBinding('@fade') a = true;

  constructor() { }

  ngOnInit() {
  }

}
