import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';

import { DbService } from '@core/services/db.service';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'th-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  userUid: string;
  categories: string[];
  newCategory: string;
  markers: Object[];
  selectedCat: string = null;
  selectedModalCat: string = null;
  deleteCat: string = null;
  filteredMarkers: Object[];
  editMarker: any;

  constructor(
    private dbService: DbService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {  }

  ngOnInit() {
    this.dbService.userUid$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        userUid => this.userUid = userUid,
        error => console.log(error)
      );
    this.dbService.categories$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        categories => {
          if (this.selectedCat === (null || undefined) && categories[0]) {
            this.selectedCat = categories[0];
            this.selectedModalCat = categories[0];
          }
          if (this.deleteCat === this.selectedCat) {
            this.selectedCat = categories[0];
            this.selectedModalCat = categories[0];
          }
          this.categories = categories;
          this.cd.markForCheck();
        },
        error => console.log(error)
      );
    this.dbService.markers$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        markers => {
          this.markers = markers;
          this.cd.markForCheck();
          this.editMarker = markers[0];
          this.onChange(this.selectedCat);
        },
        error => console.log(error)
      );
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
  }

  onChange(selectedCat: string): void {
    this.filteredMarkers = (this.markers as any).filter(marker => marker.category === selectedCat);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
