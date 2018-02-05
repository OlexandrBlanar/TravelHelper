import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CategoryService {

  public categories: BehaviorSubject<string[]>;

  constructor(private afs: AngularFirestore) {
    this.categories = new BehaviorSubject([]);
  }

  addCategory(userUid: string, newCategory: string): void {
    console.log(newCategory);
    const categories = {
      categories: newCategory
    };
    this.afs.collection('users').doc(userUid)
      .set(categories);
  }

}
