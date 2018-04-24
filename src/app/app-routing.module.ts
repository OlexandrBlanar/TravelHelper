import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

// import { NotFoundComponent } from './shared/components/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  // {
  //   path: 'map',
  //   loadChildren: './map/map.module#MapModule'
  // },
  // {
  //   path: 'category',
  //   loadChildren: './categories/categories.module#CategoriesModule'
  // }
//   {path: 'home', loadChildren: './core/core.module#CoreModule'},
//   {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
