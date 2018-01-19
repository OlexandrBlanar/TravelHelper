import { Coords } from './../../shared/models/coords';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MapService } from './map.service';

declare let google;

@Component({
  selector: 'th-maps',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('searchTextField') searchTextFieldElement: ElementRef;

  map: any;
  automplete: any;
  coords: Coords;
  zoom: number;
  
  constructor(private mapService: MapService) { }

  ngOnInit() {
    this.setCurrentPosition()
      .then(
        () => this.initMap(),
        error => {
          console.log(error);
          this.initMap();
        }
      );
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: this.zoom,
      center: this.coords
    });
    let marker = new google.maps.Marker({
      position: this.coords,
      map: this.map
    });
    this.automplete = new google.maps.places.Autocomplete(this.searchTextFieldElement.nativeElement);
    this.automplete.addListener('place_changed', () => this.setNewCoords());
    this.map.addListener('click', this.onClickMap.bind(this));
  }

  setNewCoords() {
    this.coords = this.automplete.getPlace().geometry.location;
    this.map.setCenter(this.coords);
  }

  onClickMap(e) {
    console.log(e);
    this.mapService.place.next(e);
    const googleService = new google.maps.places.PlacesService(this.map);
    const placeId = {
      placeId: e.placeId
    };
    googleService.getDetails(placeId, (place, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        console.log(place);
        this.mapService.placeInfo.next(place);
      }
    });
  }

  private setCurrentPosition() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
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
        reject(new Error("Геолокация октлючена"));
      }
    });
  }

}
