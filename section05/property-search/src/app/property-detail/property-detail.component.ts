import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PropertyService } from '../property.service';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.css']
})
export class PropertyDetailComponent implements OnInit {
  // HTTP request
  // handle the router parameter
  property;
  photo;
  constructor(private activatedRoute: ActivatedRoute, private propertyService: PropertyService) {
    this.activatedRoute.paramMap
    .switchMap((params: ParamMap) =>
      this.propertyService.listOneProperty(params.get('propertyID')))
      .subscribe((response: any) => {
        this.property = response;
        this.photo = `http://localhost:3000/${response.content.property.photos[0]}`;
      });
  }

  ngOnInit() {
  }

}
