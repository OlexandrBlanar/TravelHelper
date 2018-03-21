import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MapComponent } from './map-main/map.component';
import { InfoPlaceComponent } from './info-place/info-place.component';
import { InfoPlaceService } from './info-place/info-place.service';
import { MapRouter } from './map.routing';

@NgModule({
  imports: [
    CommonModule,
    MapRouter,
    FormsModule
  ],
  declarations: [
    MapComponent,
    InfoPlaceComponent
  ],
  providers: [InfoPlaceService]
})
export class MapModule { }
