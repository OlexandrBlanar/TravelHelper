import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {CategoryComponent} from '@app/categories/category-main/category.component';
import {ModalCategoryComponent} from '@app/categories/modal-category/modal-category.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    children: [
      {
        path: 'modal/:name',
        component: ModalCategoryComponent
      }
    ]
  }
];
export const CategoryRouter: ModuleWithProviders = RouterModule.forChild(routes);
