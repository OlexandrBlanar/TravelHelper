import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MapComponent } from './map-main/map.component';
import { InfoPlaceComponent } from './info-place/info-place.component';
import { MapRouter } from './map.routing';

@NgModule({
  imports: [
    CommonModule,
    MapRouter
  ],
  declarations: [
    MapComponent,
    InfoPlaceComponent
  ]
})
export class MapModule { }
