import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css']
})
export class PropertyListComponent implements OnInit {
  properties;

  maxSize = 5;
  totalItems;
  currentPage = 1;
  page;

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
    this.page = 1;
    this.propertyService.listAllProperties(0)
      .subscribe((response: any) => {
        this.properties = response.documents;
        this.totalItems = response.total;
      });
  }

  pageChanged(event) {
    this.page = event;
    this.propertyService.listAllProperties(+this.page)
    .subscribe((response: any) => {
      this.properties = response.documents;
      this.totalItems = response.total;
    });
  }

}
