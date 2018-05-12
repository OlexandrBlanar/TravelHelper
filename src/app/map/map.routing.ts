import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MapComponent } from './map-main/map.component';
import {MapModalComponent} from '@app/map/map-modal/map-modal.component';
import {NotFoundComponent} from '@app/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: MapComponent,
    children: [
      {
        path: 'modal',
        component: MapModalComponent
      },
    ]
  }
];
export const MapRouter: ModuleWithProviders = RouterModule.forChild(routes);
