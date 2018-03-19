import { Component, OnInit, OnDestroy } from '@angular/core';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';
import { DbService } from '@core/services/db.service';
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
  markers: Object[];
  selectedCat: string = null;
  deleteCat: string = null;
  filteredMarkers: string[];

  constructor(private dbService: DbService) {  }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(userUid => this.userUid = userUid);
    this.dbService.categories$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(categories => {
        if (this.selectedCat === (null || undefined) && categories[0]) {
          this.selectedCat = categories[0];
          console.log(this.selectedCat);
        }
        if (this.deleteCat === this.selectedCat) {
          this.selectedCat = categories[0];
        }
        this.categories = categories;
      });
    this.dbService.markers$
      .takeUntil(this.ngUnsubscribe)
      .subscribe(markers => {
        console.log(markers);
        this.markers = markers;
        this.onChange(this.selectedCat);
      });
  }

  onAddCategory(): void {
    this.dbService.addCategory(this.userUid, this.newCategory, this.categories);
    this.newCategory = '';
  }

  onDeleteCategory(): void {
    (this.markers as any).forEach(marker => {
      if (marker.category === this.selectedCat) {
        this.dbService.deleteMarker(this.userUid, marker.name);
      }
    });
    this.dbService.deleteCategory(this.userUid, this.selectedCat, this.categories);
    this.deleteCat = this.selectedCat;
    console.log(this.selectedCat);
  }

  onChange(selectedCat: string): void {
    this.filteredMarkers = (this.markers as any).filter(marker => marker.category === selectedCat);
    console.log(this.selectedCat);
  }

  deleteMarker(marker: string): void {
    this.dbService.deleteMarker(this.userUid, marker);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}