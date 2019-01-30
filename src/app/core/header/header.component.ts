import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'th-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  title: string;

  constructor() { }

  ngOnInit() {
    this.title = 'travel helper';
  }

}
