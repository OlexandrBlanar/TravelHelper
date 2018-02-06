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

export class MapService implements OnInit {

    public place: BehaviorSubject<any>;
    public placeInfo: BehaviorSubject<any>;
    public userUid: string;

    constructor(private afs: AngularFirestore) {
        this.place = new BehaviorSubject('');
        this.placeInfo = new BehaviorSubject('');
    }

    ngOnInit() {
    }

    public addMarker(userUid: string, place: any, category: string): void {
        this.userUid = userUid;
        console.log(place);
        const newMarker = {
            name: place.name,
            category: category,
            coments: '',
            lat: place.latLng.lat(),
            lng: place.latLng.lng()
        };
        if (place.placeId) {
            this.afs.collection('users').doc(userUid)
                .collection('markers').doc(place.name).set(newMarker);
        } else {
            this.afs.collection('users').doc(userUid)
                .collection('markers').doc(place.name).set(newMarker);
        }

    }

    getCategories(userUid: string) {
        console.log(userUid);
        return this.afs.collection('users').doc('QapfApMP1qO3Eql80nFVmhvR4Aj1')
            .snapshotChanges();
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
