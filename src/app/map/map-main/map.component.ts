import {Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';

import { MapService } from '../map.service';
import { DbService } from '@core/services/db.service';
import { Coords } from '../models/coords';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/catch';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { Subject } from 'rxjs/Subject';

declare let google;

@Component({
  selector: 'th-maps',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnDestroy, OnInit {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchTextField') searchTextFieldElement: ElementRef;

  isMenu = false;
  infoPlaceIsOpen = false;
  coordsMenu: Object;
  categories: string[];
  selectedCat: string = null;
  private filteredMarkers: string[];
  private ngUnsubscribe = new Subject<void>();
  private map: any;
  private autocomplete: any;
  private autocompleteMarker: any;
  private infoWindow: any;
  private coords: Coords;
  private zoom: number;
  private userUid: string;
  private markers: Object[];

  constructor(
    private mapService: MapService,
    private dbService: DbService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    let isChangeZoom = true;
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        data => this.userUid = data,
        error => console.log(error)
        );
    Observable.fromPromise(this.setCurrentPosition())
      .catch(error => {
          console.log(error);
          return Observable.of(`Bad Promise: ${error}`);
        })
      .switchMap(() => {
        return combineLatest(this.dbService.markers$, this.dbService.categories$);
      })
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        ([markers, categories]) => {
          this.categories = categories;
          this.initMap(false);
          if (this.selectedCat === null && categories[0]) {
            this.selectedCat = categories[0];
          }
          this.markers = markers;
          this.cd.markForCheck();
          if (markers[0] && categories[0]) {
            this.onChange(this.selectedCat, isChangeZoom);
            isChangeZoom = false;
          }
        },
        error => console.log(error)
      );
  }

  initMap(isChangeZoom: Boolean): void {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this.zoom,
      center: this.coords
    });
    const markersBounds = new google.maps.LatLngBounds();
    this.infoWindow = new google.maps.InfoWindow();
    this.autocompleteMarker = new google.maps.Marker({
      map: this.map,
      anchorPoint: new google.maps.Point(0, -29)
    });
    if (this.filteredMarkers) {
      const markers = this.filteredMarkers.map((marker) => this.setMarker(marker));
      markers.forEach(marker => {
        markersBounds.extend(marker.position);
        marker.addListener('click', () => {
          this.hideAllInfoWindows(markers);
          marker.infowindow.open(this.map, marker);
        });
      });
    }
    this.autocomplete = new google.maps.places.Autocomplete(this.searchTextFieldElement.nativeElement);
    this.autocomplete.addListener('place_changed', () => this.setNewCoords());
    this.map.addListener('click', this.onClickMap.bind(this));
    this.map.addListener('rightclick', this.onRightClick.bind(this));
    this.map.addListener('zoom_changed', () => this.zoom = this.map.getZoom());
    this.map.addListener('center_changed', () => this.coords = this.map.getCenter());
    // markers.forEach((marker) => marker.addListener('click', () => {
    //   this.hideAllInfoWindows(markers);
    //   marker.infowindow.open(this.map, marker);
    // }));
    if (isChangeZoom) {
      this.map.setCenter(markersBounds.getCenter(), this.map.fitBounds(markersBounds));
    }
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
      top: e.Ia.clientY + 30 + 'px',
      left: e.Ia.clientX + 'px'
    };
  }

  private setNewCoords(): void {
    this.infoWindow.close();
    this.autocompleteMarker.setVisible(false);
    const place = this.autocomplete.getPlace();
    if (!place || !place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      // window.alert("No details available for input: '" + this.searchTextFieldElement.nativeElement);
      console.log('No details available for input:');
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport);
    } else {
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(17);  // Why 17? Because it looks good.
    }
    this.autocompleteMarker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    this.autocompleteMarker.setPosition(place.geometry.location);
    this.autocompleteMarker.setVisible(true);
    let address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }
    this.infoWindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    this.infoWindow.open(this.map, this.autocompleteMarker);
  }

  private onClickMap(e): void {
    this.mapService.place.next(e);
    this.infoPlaceIsOpen = true;
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
      this.infoPlaceIsOpen = false;
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

  onChange(selectedCat: string, isChangeZoom = true): void {
    this.filteredMarkers = (this.markers as any).filter(marker => marker.category === selectedCat);
    this.initMap(isChangeZoom);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
