import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@auth/auth.service';
import { AuthGuardService } from '@auth/auth-guard.service';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { AuthModule } from '@auth/auth.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '@env/environment';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapService } from './map/map.service';
import { DbService } from '@core/services/db.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    HttpClientJsonpModule,
    AuthModule,
    CoreModule,
    SharedModule,
    NgbModule.forRoot()
  ],
  providers: [
    AuthService,
    MapService,
    DbService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
