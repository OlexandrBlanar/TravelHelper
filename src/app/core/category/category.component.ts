import { Component, OnInit, OnDestroy } from '@angular/core';
import { CategoryService } from './category.service';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';
import { DbService } from '../../shared/services/db.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'th-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private userUid: string;
  categories: string[];
  newCategory: string;
  markers: string[];
  selectedCat: string;

  constructor(private dbService: DbService) {
    this.categories = [];
  }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(userUid => this.userUid = userUid);
    this.dbService.categories$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(categories => this.categories = categories);

    this.dbService.markers$
      .map(markers => {
        console.log(markers);
        return markers.filter(marker => marker.category = this.selectedCat);
      })
      .map(markers => {
        console.log(markers);
        return markers.map(marker => marker.category);
      })
      .takeUntil(this.ngUnsubscribe)
      .subscribe(markers => this.markers);
  }

  onAddCategory() {
    this.dbService.addCategory(this.userUid, this.newCategory, this.categories);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
