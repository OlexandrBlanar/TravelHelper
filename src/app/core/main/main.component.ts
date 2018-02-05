import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'th-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(private dbService: DbService) { }

  ngOnInit() {
    this.dbService.getUser().onAuthStateChanged(user => {
      this.dbService.userUid.next(user.uid);
      this.dbService.getCategories(user.uid)
        // .map(data => data)
        .subscribe(data => {
          console.log(data);
          this.dbService.categories.next(data.categories);
        });
    });

  }

}
