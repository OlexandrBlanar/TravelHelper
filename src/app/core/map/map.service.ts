import { OnInit } from '@angular/core';
import { ICoords } from './map.service';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export interface ICoords {
    lat: number;
    lng: number;
}

@Injectable()

export class MapService {

    public place: BehaviorSubject<any>;
    public placeInfo: BehaviorSubject<any>;
    public userUid: string;

    constructor(private afs: AngularFirestore) {
        this.place = new BehaviorSubject('');
        this.placeInfo = new BehaviorSubject('');
        this.userUid = '';
    }

    public addMarker(userUid: any, place: any): void {
        this.userUid = userUid;
        console.log(place);
        const latLng = {
            lat: place.latLng.lat(),
            lng: place.latLng.lng()
        };
        if (place.placeId) {
            this.afs.collection('users').doc(userUid)
                .collection('categories').doc('categories')
                .collection('markers').doc(place.name).set(latLng);
        } else {
            this.afs.collection('users').doc(userUid)
                .collection('categories').doc('categories')
                .collection('markers').doc(place.name).set(latLng);
        }

    }

    getCategories() {
        return this.afs.collection('users').doc(this.userUid)
            .valueChanges();
    }

    // public setCurrentPosition() {
    //     return new Promise((resolve, reject) => {
    //       if ("geolocation" in navigator) {
    //         navigator.geolocation.getCurrentPosition((position) => {
    //           const coords: ICoords = {lat: position.coords.latitude, lng: position.coords.longitude};
    //           resolve(coords);
    //         });
    //       } else {
    //         reject(new Error("Геолокация октлючена"));
    //       }
    //     });
    //   }
}
