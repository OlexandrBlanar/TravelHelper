import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main/main.component';
import { AuthGuardService } from '@auth/auth-guard.service';
import {NotFoundComponent} from '@app/not-found/not-found.component';

const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {
      path: 'categories',
      loadChildren: '../categories/categories.module#CategoriesModule',
      canLoad: [AuthGuardService]
    },
    {
      path: 'map',
      loadChildren: '../map/map.module#MapModule',
      canLoad: [AuthGuardService]
    },
    {
      path: '**',
      component: NotFoundComponent
    }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
