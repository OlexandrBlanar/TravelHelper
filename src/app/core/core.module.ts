import { CoreRoutingModule } from './core-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NavbarComponent } from './navbar/navbar.component';
import { MainComponent } from './main/main.component';
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
    MainComponent,
  ],
  providers: [],
})
export class CoreModule { }
