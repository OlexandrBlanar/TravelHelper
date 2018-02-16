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

    place: BehaviorSubject<any>;
    placeInfo: BehaviorSubject<any>;

    constructor(private afs: AngularFirestore) {
        this.place = new BehaviorSubject('');
        this.placeInfo = new BehaviorSubject('');
    }

    ngOnInit() {
    }

    addMarker(userUid: string, place: any, category: string): void {
        const newMarker = {
            name: place.name,
            category: category,
            coments: '',
            lat: place.latLng.lat(),
            lng: place.latLng.lng()
        };
        this.afs.collection('users').doc(userUid)
            .collection('markers').doc(place.name).set(newMarker);
    }
}
