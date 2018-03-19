import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map-main/map.component';



const routes: Routes = [
  {
    path: '',
    component: MapComponent,
  }
];

export const MapRouter: ModuleWithProviders = RouterModule.forChild(routes);
