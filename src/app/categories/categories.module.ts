import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category-main/category.component';
import { FormsModule } from '@angular/forms';

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
