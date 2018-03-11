import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map/map.service';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';

import { wikiUrl } from '../../shared/constants';
import { InfoPlaceService } from './info-place.service';
import { DbService } from '../../shared/services/db.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'th-info-place',
  templateUrl: './info-place.component.html',
  styleUrls: ['./info-place.component.scss']
})
export class InfoPlaceComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userUid: string;
  placeInfo: any;
  categories: string[];
  newCategory: string;
  selectedCat: string;
  isModal: Boolean = false;

  constructor(
    private mapService: MapService,
    private dbService: DbService,
    private authService: AuthService,
    private infoPlaceService: InfoPlaceService
  ) {
    this.placeInfo = '';
  }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(userUid => this.userUid = userUid);
    this.dbService.categories$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(categories => {
        if (this.selectedCat === undefined && categories[0]) {
          this.selectedCat = categories[0];
        }
        this.categories = categories;
      });

    this.mapService.placeInfo
      .takeUntil(this.ngUnsubscribe)
      .subscribe(placeInfo => {
        this.placeInfo = placeInfo;
        if (placeInfo.name) {
          this.infoPlaceService.getWikiInfo(placeInfo.name);
        }
      });
  }

  onAddMarker() {
    if (this.placeInfo.name) {
      console.log(this.newCategory);
      this.placeInfo.latLng = this.placeInfo.geometry.location;
      this.dbService.addMarker(this.userUid, this.placeInfo, this.newCategory || this.selectedCat);
    } else {
      this.placeInfo.name = '_' + Math.random().toString(36).substr(2, 9);
      this.dbService.addMarker(this.userUid, this.placeInfo, this.newCategory || this.selectedCat);
    }
    if (this.newCategory) {
      this.dbService.addCategory(this.userUid, this.newCategory, this.categories);
      this.newCategory = '';
    }
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
