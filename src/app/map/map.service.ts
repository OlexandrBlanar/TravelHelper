import { OnInit } from '@angular/core';
import { Coords } from './models/coords';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

}
