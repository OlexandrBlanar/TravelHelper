import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import {NotFoundComponent} from '@app/not-found/not-found.component';
import {AuthComponent} from '@auth/auth.component';
import {MainComponent} from '@core/main/main.component';
import {AuthGuardService} from '@auth/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/core/map',
    canLoad: [AuthGuardService],
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'core',
    canLoad: [AuthGuardService],
    loadChildren: './core/core.module#CoreModule',
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
