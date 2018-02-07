import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';

interface ICategoriesObj {
  categories: string[];
}

@Injectable()

export class DbService {

  categories: BehaviorSubject<string[]>;
  markers: BehaviorSubject<any>;
  userUid: BehaviorSubject<string>;

  constructor(private afs: AngularFirestore) {
    this.categories = new BehaviorSubject([]);
    this.markers = new BehaviorSubject([]);
    this.userUid = new BehaviorSubject('');
  }

  getUser() {
    return firebase.auth();
  }

  getCategories(userUid: string): Observable<any> {
    return (this.afs as any).collection('users').doc(userUid)
      .valueChanges();
  }

  getMarkers(userUid: string): Observable<any> {
    return (this.afs as any).collection('users').doc(userUid).collection('markers')
      .valueChanges();
  }

  addCategory(userUid: string, newCategory: string, categories): void {
    console.log(newCategory);
    const newCategories = {
      categories: [newCategory, ...categories]
    };
    this.afs.collection('users').doc(userUid)
      .set(newCategories);
  }

}
