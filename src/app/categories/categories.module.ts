import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category-main/category.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CategoryComponent,
    }])
  ],
  declarations: [
    CategoryComponent
  ]
})
export class CategoriesModule { }
