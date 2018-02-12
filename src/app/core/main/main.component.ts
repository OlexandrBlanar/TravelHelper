import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DbService } from '../../shared/services/db.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'th-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {
  private subCategories: Subscription;
  private subMarkers: Subscription;

  constructor(private dbService: DbService) { }

  ngOnInit() {
    this.dbService.getUser().onAuthStateChanged(user => {
      this.dbService.userUid$.next(user.uid);
      this.subCategories = this.dbService.getCategories(user.uid)
        .subscribe(data => {
          if (Object.keys(data).length !== 0) {
            this.dbService.categories$.next(data.categories);
          }
        },
        err => {
          console.error('Oops:', err.message);
        });
      this.subMarkers = this.dbService.getMarkers(user.uid)
        .subscribe(data => {
          if (data.length !== 0) {
            this.dbService.markers$.next(data);
          }
          console.log(data);
        },
        err => {
          console.error('Oops:', err.message);
        });
    });
  }

  ngOnDestroy() {
    this.subCategories.unsubscribe();
    this.subMarkers.unsubscribe();
  }

}
