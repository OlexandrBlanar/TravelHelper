import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';

import { MapService } from '../map.service';
import { DbService } from '@core/services/db.service';
import { Coords } from '../models/coords';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/combineLatest';
import { combineLatest } from 'rxjs/observable/combineLatest';
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

  isMenu = false;
  coordsMenu: Object;
  categories: string[];
  selectedCat: string = null;
  private filteredMarkers: string[];
  private ngUnsubscribe = new Subject<void>();
  private map: any;
  private automplete: any;
  private coords: Coords;
  private zoom: number;
  private userUid: string;
  private markers: Object[];

  constructor(
    private mapService: MapService,
    private dbService: DbService,
    private combaineLatest: combineLatest
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
        return Observable.combaineLatest(this.dbService.markers$, this.dbService.categories$);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe([markers, categories] => {
        this.markers = markers;
        if (markers[0]) {
          this.onChange(this.selectedCat);
          this.initMap();
        }
      });
    this.dbService.categories$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(categories => {
        if (this.selectedCat === null && categories[0]) {
          this.selectedCat = categories[0];
        }
        this.categories = categories;
      });
  }

  initMap(): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this.zoom,
      center: this.coords
    });
    const markers = this.filteredMarkers.map((marker) => this.setMarker(marker));
    this.automplete = new google.maps.places.Autocomplete(this.searchTextFieldElement.nativeElement);
    this.automplete.addListener('place_changed', () => this.setNewCoords());
    this.map.addListener('click', this.onClickMap.bind(this));
    this.map.addListener('rightclick', this.onRightClick.bind(this));
    this.map.addListener('zoom_changed', () => this.zoom = this.map.getZoom());
    this.map.addListener('center_changed', () => this.coords = this.map.getCenter());
    markers.forEach((marker) => marker.addListener('click', () => {
      this.hideAllInfoWindows(markers);
      marker.infowindow.open(this.map, marker);
    }));
  }

  private setMarker(marker) {
    let contentString;
    if (marker.comments) {
      contentString = `<div id="iw-container">
      <div class="iw-title">${marker['name']}</div>
      <div class="iw-content" *ngIf="marker['comments']">${marker['comments']}</div>
    </div>`;
    } else {
      contentString = `<div id="iw-container">
      <div class="iw-title">${marker['name']}</div>
    </div>`;
    }
    const locationInfowindow = new google.maps.InfoWindow({
      content: contentString
    });
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
      map: this.map,
      infowindow: locationInfowindow
    });
  }

  private hideAllInfoWindows(markers) {
    markers.forEach((marker) => marker.infowindow.close(this.map, marker));
  }

  private onRightClick(e) {
    this.isMenu = true;
    this.coordsMenu = {
      top: e.Fa.clientY + 60 + 'px',
      left: e.Fa.clientX + 'px'
    };
  }

  private setNewCoords(): void {
    this.coords = this.automplete.getPlace().geometry.location;
    this.zoom = 12;
    this.map.setCenter(this.coords);
    this.map.setZoom(this.zoom);
  }

  private onClickMap(e): void {
    this.mapService.place.next(e);

    if (e.placeId) {
      const googleService = new google.maps.places.PlacesService(this.map);
      const placeId = {
        placeId: e.placeId || ''
      };
      googleService.getDetails(placeId, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
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

  onChange(selectedCat: string): void {
    this.filteredMarkers = (this.markers as any).filter(marker => marker.category === selectedCat);
    this.initMap();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
