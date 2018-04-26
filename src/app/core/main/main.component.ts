import { Component, OnInit, OnDestroy } from '@angular/core';

import { DbService } from '../services/db.service';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';

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
      if (user) {
        this.dbService.userUid$.next(user.uid);
        this.subCategories = this.dbService.getCategories(user.uid)
          .catch(error => Observable.of(error))
          .subscribe(
            data => {
            this.dbService.categories$.next(data.categories);
            },
            err => {
              console.error('Oops:', err.message);
            });
        this.subMarkers = this.dbService.getMarkers(user.uid)
          .catch(error => Observable.of(error))
          .subscribe(
            data => {
              this.dbService.markers$.next(data);
            },
            err => {
              console.error('Oops:', err.message);
            });
      }
    });
  }

  ngOnDestroy() {
    this.subCategories.unsubscribe();
    this.subMarkers.unsubscribe();
  }

}
