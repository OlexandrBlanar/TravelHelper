import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from '../auth/auth-guard.service';



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
      // canLoad: [AuthGuardService]
    },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
