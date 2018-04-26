import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import { AuthService } from '@auth/auth.service';

import { InfoPlaceService } from './info-place.service';
import { DbService } from '@core/services/db.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'th-info-place',
  templateUrl: './info-place.component.html',
  styleUrls: ['./info-place.component.scss']
})
export class InfoPlaceComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userUid: string;
  markerName: string;
  comments = '';
  placeInfo: any;
  wikiInfo: string;
  wikiPageUrl: string;
  categories: string[];
  newCategory: string;
  selectedCat: string;
  isModal: Boolean = false;

  constructor(
    private mapService: MapService,
    private dbService: DbService,
    private authService: AuthService,
    private infoPlaceService: InfoPlaceService
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
            this.infoPlaceService.getWikiInfo(`${this.placeInfo.name} +${this.placeInfo.address_components[2].long_name}`)
              .switchMap(data => {
                this.wikiInfo = data.extract;
                return this.infoPlaceService.getWikiPageUrl((data as any).pageid);
              })
              .catch(error => Observable.of(error))
              .subscribe(
                url => this.wikiPageUrl = url.canonicalurl,
                error => console.log(error)
              );
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
    this.closeModal();
  }

  openModal(): void {
    this.isModal = true;
  }

  closeModal(): void {
    this.isModal = false;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
