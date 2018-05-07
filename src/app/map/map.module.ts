import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MapComponent } from './map-main/map.component';
import { InfoPlaceComponent } from './info-place/info-place.component';
import { InfoPlaceService } from './info-place/info-place.service';
import { MapRouter } from './map.routing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { MapModalComponent } from './map-modal/map-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MapRouter,
    FormsModule,
    NgbModule
  ],
  declarations: [
    MapComponent,
    InfoPlaceComponent,
    MapModalComponent
  ],
  providers: [InfoPlaceService]
})
export class MapModule { }
