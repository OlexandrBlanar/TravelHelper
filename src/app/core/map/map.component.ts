import { Coords } from './../../shared/models/coords';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';
import { MapService } from './map.service';
import { DbService } from '../../shared/services/db.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';

declare let google;

@Component({
  selector: 'th-maps',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnDestroy, OnInit {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchTextField') searchTextFieldElement: ElementRef;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private map: any;
  private automplete: any;
  private coords: Coords;
  private zoom: number;
  private userUid: string;
  private locations: Object[];

  constructor(private mapService: MapService, private dbService: DbService) { }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => this.userUid = data);
    Observable.fromPromise(this.setCurrentPosition())
      .catch(error => {
          console.log(error);
          this.initMap();
          return Observable.of(`Bad Promise: ${error}`);
        })
      .switchMap(() => {
        return this.dbService.markers$;
      })
      .takeUntil(this.ngUnsubscribe)
      .map(markers => markers.map(marker => {
        return {
        lat: marker.lat,
        lng: marker.lng
        };
      }))
      .subscribe(locations => {
        this.locations = locations;
        this.initMap();
      });
  }

  initMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this.zoom,
      center: this.coords
    });
    const markers = this.locations.map(location => {
      return new google.maps.Marker({
        position: location,
        map: this.map
      });
    });
    this.automplete = new google.maps.places.Autocomplete(this.searchTextFieldElement.nativeElement);
    this.automplete.addListener('place_changed', () => this.setNewCoords());
    this.map.addListener('click', this.onClickMap.bind(this));
  }

  setNewCoords(): void {
    this.coords = this.automplete.getPlace().geometry.location;
    this.zoom = 2;
    this.map.setCenter(this.coords);
  }

  onClickMap(e): void {
    console.log(e);
    this.mapService.place.next(e);

    if (e.placeId) {
      const googleService = new google.maps.places.PlacesService(this.map);
      const placeId = {
        placeId: e.placeId || ''
      };
      googleService.getDetails(placeId, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(place);
          this.mapService.placeInfo.next(place);
        }
      });
    } else {
      this.mapService.placeInfo.next(e);
    }

  }

  private setCurrentPosition() {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.zoom = 12;
          resolve();
        });
      } else {
        this.coords = {lat: 49.24, lng: 28.53};
        this.zoom = 8;
        reject(new Error('Геолокация октлючена'));
      }
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
