import { Component, OnInit } from '@angular/core';
import { MapService } from '../map/map.service';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';

import { wikiUrl } from '../../shared/constants';
import { InfoPlaceService } from './info-place.service';


@Component({
  selector: 'th-info-place',
  templateUrl: './info-place.component.html',
  styleUrls: ['./info-place.component.scss']
})
export class InfoPlaceComponent implements OnInit {

  public place: any;
  public placeInfo: any;
  private userUid: string;

  constructor(
    private mapService: MapService,
    private authService: AuthService,
    private infoPlaceService: InfoPlaceService
  ) {
    this.placeInfo = '';
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.userUid = user.uid;
    });

    // this.mapService.place
    //   .subscribe(place => this.place = place);

    this.mapService.placeInfo
      .subscribe(placeInfo => {
        this.placeInfo = placeInfo;
        if (placeInfo.name) {
          this.infoPlaceService.getWikiInfo(placeInfo.name);
        }
      });
  }

  onAddMarker() {
    if (this.placeInfo.name) {
      this.placeInfo.latLng = this.placeInfo.geometry.location;
      this.mapService.addMarker(this.userUid, this.placeInfo);
    } else {
      this.placeInfo.name = '_' + Math.random().toString(36).substr(2, 9);
      this.mapService.addMarker(this.userUid, this.placeInfo);
    }
  }

}
