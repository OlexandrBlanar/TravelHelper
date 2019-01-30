import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';

import {DbService} from '@core/services/db.service';
import {MapService} from '@app/map/map.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';

@Component({
  selector: 'th-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapModalComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  private userUid: string;
  markerName: string;
  comments = '';
  placeInfo: any;
  categories: string[];
  newCategory: string;
  selectedCat: string;

  constructor(
    private mapService: MapService,
    private dbService: DbService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        userUid => this.userUid = userUid,
        error => console.log(error)
      );
    this.dbService.categories$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        categories => {
          if (this.selectedCat === undefined && categories[0]) {
            this.selectedCat = categories[0];
          }
          this.categories = categories;
        },
        error => console.log(error)
      );

    this.mapService.placeInfo
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        placeInfo => {
          this.placeInfo = placeInfo;
          if (this.placeInfo.name) {

          }
        },
        error => console.log(error)
      );
  }

  onAddMarker(): void {
    this.placeInfo.comments = this.comments;
    if (this.placeInfo.name) {
      this.placeInfo.latLng = this.placeInfo.geometry.location;
      this.dbService.addMarker(this.userUid, this.placeInfo, this.newCategory || this.selectedCat);
    } else {
      this.placeInfo.name = this.markerName;
      this.dbService.addMarker(this.userUid, this.placeInfo, this.newCategory || this.selectedCat);
    }
    if (this.newCategory) {
      this.dbService.addCategory(this.userUid, this.newCategory, this.categories);
      this.newCategory = '';
    }
    this.router.navigate(['/core/map']);
  }

  closeModal(): void {
    this.router.navigate(['/core/map']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
