import { CategoryComponent } from './category/category.component';
import { MapComponent } from './map/map.component';
import { EditPlaceComponent } from './edit-place/edit-place.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path: 'category', component: CategoryComponent},
    {path: 'map', component: MapComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}