import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {CategoryRouter} from '@app/categories/category.routing';

import { CategoryComponent } from './category-main/category.component';
import { ModalCategoryComponent } from './modal-category/modal-category.component';
import { MarkerItemComponent } from './marker-item/marker-item.component';

@NgModule({
  imports: [
    CommonModule,
    CategoryRouter,
    FormsModule
  ],
  declarations: [
    CategoryComponent,
    ModalCategoryComponent,
    MarkerItemComponent
  ]
})
export class CategoriesModule { }
