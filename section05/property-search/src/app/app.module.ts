import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './/app-routing.module';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';

import { PropertyService } from './property.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PropertyAddComponent } from './property-add/property-add.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { PropertySearchComponent } from './property-search/property-search.component';

import { NguiMapModule } from '@ngui/map';
import { PropertyGeospatialComponent } from './property-geospatial/property-geospatial.component';


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    PropertyListComponent,
    PropertyDetailComponent,
    PropertyAddComponent,
    FileSelectDirective,
    FileDropDirective,
    PropertySearchComponent,
    PropertyGeospatialComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NguiMapModule.forRoot({ apiUrl: 'https://maps.google.com/maps/api/js?libraries=drawing&key=AIzaSyCmrnu165L1Qr-jekomFCwDSe1LHWOpGfs'})
  ],
  providers: [ PropertyService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
