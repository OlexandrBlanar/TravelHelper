import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class DbService implements OnInit {

  public categories: BehaviorSubject<string[]>;
  public userUid: BehaviorSubject<string>;

  constructor(private afs: AngularFirestore) {
    this.categories = new BehaviorSubject([]);
    this.userUid = new BehaviorSubject('');
  }

  ngOnInit() {

  }

  getUser() {
    return firebase.auth();
  }

  getCategories(userUid) {
    return this.afs.collection('users').doc(userUid)
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
