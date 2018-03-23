import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { MapService } from '../map.service';
import { DbService } from '@core/services/db.service';
import { Coords } from '../models/coords';
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

  private ngUnsubscribe = new Subject<void>();
  private map: any;
  private automplete: any;
  private coords: Coords;
  private zoom: number;
  private userUid: string;
  private markers: Object[];

  constructor(
    private mapService: MapService,
    private dbService: DbService
  ) { }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => this.userUid = data);
    Observable.fromPromise(this.setCurrentPosition())
      .catch(error => {
          console.log(error);
          return Observable.of(`Bad Promise: ${error}`);
        })
      .switchMap(() => {
        return this.dbService.markers$;
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(markers => {
        this.markers = markers;
        this.initMap();
      });
  }

  initMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this.zoom,
      center: this.coords
    });
    const markers = this.markers.map((marker) => {
      console.log(marker);
      return new google.maps.Marker({
        position: {
          lat: marker['lat'],
          lng: marker['lng']
        },
        label: {
          text: marker['name'],
          color: '#7a87eb',
          fontSize: '12px',
          fontWeight: 'normal',
        },
        icon: {
          path: 'M24-28.3c-.2-13.3-7.9-18.5-8.3-18.7l-1.2-.8-1.2.8c-2 1.4-4.1 2-6.1 2-3.4 0-5.8-1.9-5.9' +
          '-1.9l-1.3-1.1-1.3 1.1c-.1.1-2.5 1.9-5.9 1.9-2.1 0-4.1-.7-6.1-2l-1.2-.8-1.2.8c-.8.6-8 5.9-8.2 ' +
          '18.7-.2 1.1 2.9 22.2 23.9 28.3 22.9-6.7 24.1-26.9 24-28.3z',
          fillColor: '#00CCBB',
          scale: 0.5,
          fillOpacity: 0.8,
          strokeColor: '',
          strokeWeight: 0,
          labelOrigin: new google.maps.Point(10, -57)
        },
        // map_icon_label: '<span class="map-icon map-icon-point-of-interest"></span>',
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
