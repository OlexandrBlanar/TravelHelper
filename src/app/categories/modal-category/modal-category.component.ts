import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {DbService} from '@core/services/db.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'th-modal-category',
  templateUrl: './modal-category.component.html',
  styleUrls: ['./modal-category.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalCategoryComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  private userUid: string;
  private markerName: string;
  categories: string[];
  markers: Object[];
  selectedCat: string = null;
  editMarker: any;

  constructor(
    private dbService: DbService,
    private router: Router,
    private route: ActivatedRoute
  ) {  }

  ngOnInit() {
    this.route.params
      .takeUntil(this.ngUnsubscribe)
      .subscribe(params => {
        this.markerName = params['name'];
      });
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
          if (this.selectedCat === null && categories[0]) {
            this.selectedCat = categories[0];
          }
          this.categories = categories;
        },
        error => console.log(error)
      );
    this.dbService.markers$
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        markers => {
          this.markers = markers;
          this.editMarker = (this.markers as any).filter(marker => marker.name === this.markerName)[0];
        },
        error => console.log(error)
      );
  }

  closeModal(): void {
    this.router.navigate(['/core/categories']);
  }

  saveChanges(): void {
    this.dbService.deleteMarker(this.userUid, this.markerName);
    this.dbService.addMarker(this.userUid, this.editMarker, this.selectedCat);
    this.router.navigate(['/core/categories']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
