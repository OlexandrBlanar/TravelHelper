import { Component, OnInit } from '@angular/core';
import { MapService } from '../map/map.service';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';


@Component({
  selector: 'th-info-place',
  templateUrl: './info-place.component.html',
  styleUrls: ['./info-place.component.scss']
})
export class InfoPlaceComponent implements OnInit {

  public place: any;
  public placeInfo: any;
  private userUid: any;

  constructor(private mapService: MapService, private authService: AuthService) {
    this.placeInfo = '';
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.userUid = user.uid;
    });

    this.mapService.place
      .subscribe(place => this.place = place);

    this.mapService.placeInfo
      .subscribe(placeInfo => this.placeInfo = placeInfo);
  }

  onAddMarker() {
    this.mapService.addMarker(this.userUid, this.place);
  }

}
