import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CoreRoutingModule } from './core-routing.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';


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
    MainComponent,
  ],
  providers: [],
})
export class CoreModule { }
