import { Component, OnInit, OnDestroy } from '@angular/core';

import { MapService } from '../map.service';
import { InfoPlaceService } from './info-place.service';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';

@Component({
  selector: 'th-info-place',
  templateUrl: './info-place.component.html',
  styleUrls: ['./info-place.component.scss']
})
export class InfoPlaceComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  placeInfo: any;
  wikiInfo: string;
  wikiPageUrl: string;

  constructor(
    private mapService: MapService,
    private infoPlaceService: InfoPlaceService,
    private router: Router
  ) {  }

  ngOnInit() {
    this.mapService.placeInfo
      .takeUntil(this.ngUnsubscribe)
      .catch(error => Observable.of(error))
      .subscribe(
        placeInfo => {
          this.placeInfo = placeInfo;
          if (this.placeInfo.name) {
            this.infoPlaceService.getWikiInfo(`${this.placeInfo.name} +${this.placeInfo.address_components[2].long_name}`)
              .switchMap(data => {
                this.wikiInfo = data.extract;
                return this.infoPlaceService.getWikiPageUrl((data as any).pageid);
              })
              .catch(error => Observable.of(error))
              .subscribe(
                url => this.wikiPageUrl = url.canonicalurl,
                error => console.log(error)
              );
          }
        },
        error => console.log(error)
      );
  }

  openModal(): void {
    this.router.navigate(['/map/modal']);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
