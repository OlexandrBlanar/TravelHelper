import { Injectable } from '@angular/core';

import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';

@Injectable()
export class DbService {

  categories$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  markers$: BehaviorSubject<any> = new BehaviorSubject([]);
  userUid$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(private afs: AngularFirestore) { }

  getUser() {
    return firebase.auth();
  }

  getCategories(userUid: string): Observable<any> {
    return (this.afs as any).collection('users').doc(userUid)
      .valueChanges();
  }

  getMarkers(userUid: string): Observable<any> {
    console.log(userUid);
    return (this.afs as any).collection('users').doc(userUid).collection('markers')
      .valueChanges();
  }

  addMarker(userUid: string, place: any, category: string): void {
    const newMarker = {
        name: place.name,
        category: category,
        comments: place.comments,
        lat: place.latLng.lat(),
        lng: place.latLng.lng()
    };
    this.afs.collection('users').doc(userUid)
        .collection('markers').doc(place.name).set(newMarker);
  }

  deleteMarker(userUid: string, marker: string): void {
    console.log(marker);
    (this.afs as any).collection('users').doc(userUid).collection('markers').doc(marker)
      .delete()
      .then(() => console.log('Marker successfully deleted'))
      .catch((err) => console.log(err));
  }

  addCategory(userUid: string, newCategory: string, categories: string[]): void {
    console.log(newCategory);
    const newCategories = {
      categories: [newCategory, ...categories]
    };
    this.afs.collection('users').doc(userUid)
      .set(newCategories);
  }

  deleteCategory(userUid: string, deleteCategory: string, categories: string[]): void {
    const newCategories = {
      categories: categories.filter(category => category !== deleteCategory)
    };
    console.log(deleteCategory);
    console.log(newCategories);
    this.afs.collection('users').doc(userUid)
      .set(newCategories);
  }

}
