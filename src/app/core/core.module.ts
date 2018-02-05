import { CoreRoutingModule } from './core-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MapComponent } from './map/map.component';
import { InfoPlaceComponent } from './info-place/info-place.component';
import { EditPlaceComponent } from './edit-place/edit-place.component';
import { CategoryComponent } from './category/category.component';
import { MainComponent } from './main/main.component';
import { EditCategoryComponent } from './edit-category/edit-category.component';
import { CategoryService } from './category/category.service';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    NavbarComponent,
    MapComponent,
    InfoPlaceComponent,
    EditPlaceComponent,
    CategoryComponent,
    MainComponent,
    EditCategoryComponent
  ],
  providers: [CategoryService],
})
export class CoreModule { }
