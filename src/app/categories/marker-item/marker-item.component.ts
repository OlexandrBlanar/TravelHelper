import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {DbService} from '@core/services/db.service';

@Component({
  selector: 'th-marker-item',
  templateUrl: './marker-item.component.html',
  styleUrls: ['./marker-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class MarkerItemComponent implements OnInit {
  @Input() markers: Object[];
  @Input() user: string;
  constructor(
    private dbService: DbService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  openModal(marker: any): void {
    this.router.navigate(['/core/categories/modal', marker.name]);
  }

  deleteMarker(marker: string): void {
    this.dbService.deleteMarker(this.user, marker);
  }

}
