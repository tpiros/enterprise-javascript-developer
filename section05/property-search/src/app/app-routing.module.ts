import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { PropertyListComponent } from './property-list/property-list.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { PropertyAddComponent } from './property-add/property-add.component';
import { PropertySearchComponent } from './property-search/property-search.component';
import { PropertyGeospatialComponent } from './property-geospatial/property-geospatial.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'properties', component: PropertyListComponent },
  { path: 'property/:propertyID', component: PropertyDetailComponent },
  { path: 'add', component: PropertyAddComponent },
  { path: 'search', component: PropertySearchComponent },
  { path: 'geospatial', component: PropertyGeospatialComponent },
  { path: '**', component: WelcomeComponent } // 404 handler
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
