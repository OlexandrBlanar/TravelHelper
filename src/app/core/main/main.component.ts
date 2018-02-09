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
          this.dbService.categories$.next(data.categories);
        });
      this.subMarkers = this.dbService.getMarkers(user.uid)
        .subscribe(data => {
          console.log(data);
          this.dbService.markers$.next(data);
        });
    });
  }

  ngOnDestroy() {
    this.subCategories.unsubscribe();
    this.subMarkers.unsubscribe();
  }

}
