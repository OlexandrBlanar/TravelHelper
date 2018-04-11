import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapService } from '../map.service';
import { AuthService } from '@auth/auth.service';

import { InfoPlaceService } from './info-place.service';
import { DbService } from '@core/services/db.service';
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
        console.log(this.placeInfo);
        if (this.placeInfo.name) {
          this.infoPlaceService.getWikiInfo(`${this.placeInfo.name} +${this.placeInfo.address_components[2].long_name}`)
            .switchMap(data => {
              console.log(data);
              this.wikiInfo = data.extract;
              return this.infoPlaceService.getWikiPageUrl((data as any).pageid);
            })
            .subscribe(url => console.log(url.canonicalurl));
        }
      });
  }

  onAddMarker(): void {
    this.placeInfo.comments = this.comments;
    if (this.placeInfo.name) {
      console.log(this.newCategory);
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
    console.log(this.comments);
    this.closeModal();
  }

  openModal(): void {
    console.log(this.placeInfo.name);
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
