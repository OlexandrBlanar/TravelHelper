import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CategoryComponent } from './category-main/category.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: '',
      component: CategoryComponent,
    }]),
    FormsModule
  ],
  declarations: [
    CategoryComponent
  ]
})
export class CategoriesModule { }
