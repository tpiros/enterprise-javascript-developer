import { Component, OnInit, ViewChild } from '@angular/core';
import { DrawingManager } from '@ngui/map';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-property-geospatial',
  templateUrl: './property-geospatial.component.html',
  styleUrls: ['./property-geospatial.component.css']
})
export class PropertyGeospatialComponent implements OnInit {

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;
  properties;

  maxSize = 5;
  totalItems;
  currentPage = 1;
  page;

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
    this.page = 1;
    this.drawingManager['initialized$'].subscribe(dm => {
      google.maps.event.addListener(dm, 'overlaycomplete', event => {
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          dm.setDrawingMode(null);
          google.maps.event.addListener(dm, 'circlecomplete', e => {
            this.selectedOverlay = event.overlay;
            this.selectedOverlay.setEditable(true);
            const radius = this.selectedOverlay.getRadius();
            console.log(radius);
            const latitude = this.selectedOverlay.getCenter().lat();
            const longitude = this.selectedOverlay.getCenter().lng();
            this.propertyService.geospatial(radius, latitude, longitude, 0).subscribe((response: any) => {
            this.properties = response.documents;
            this.totalItems = response.total;
            });
          });
          this.selectedOverlay = event.overlay;
        }
      });
    });
}

  pageChanged($event) {
    const radius = this.selectedOverlay.getRadius();
    const latitude = this.selectedOverlay.getCenter().lat();
    const longitude = this.selectedOverlay.getCenter().lng();
    this.propertyService.geospatial(radius, latitude, longitude, +this.page)
    .subscribe((response: any) => {
      this.properties = response.documents;
      this.totalItems = response.total;
    });
  }

}
