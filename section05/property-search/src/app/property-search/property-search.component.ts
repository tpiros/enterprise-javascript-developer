import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PropertyService } from './../property.service';
import { DrawingManager } from '@ngui/map';

@Component({
  selector: 'app-property-search',
  templateUrl: './property-search.component.html',
  styleUrls: ['./property-search.component.css']
})
export class PropertySearchComponent implements OnInit {
  form: FormGroup;
  term = new FormControl('', Validators.required);
  properties;

  maxSize = 5;
  totalItems;
  currentPage = 1;
  page;

  selectedOverlay: any;
  @ViewChild(DrawingManager) drawingManager: DrawingManager;

  constructor(private formBuilder: FormBuilder, private propertyService: PropertyService) {
    this.form = formBuilder.group({
      term: this.term
    });
  }

  ngOnInit() {
  }

  submitSearchForm() {
    this.page = 1;
    this.propertyService.search(this.form.value.term, 0).subscribe((response: any) => {
      this.properties = response.documents;
      this.totalItems = response.total;
    });
  }

  pageChanged($event) {
    this.propertyService.search(this.form.value.term, +this.page)
    .subscribe((response: any) => {
      this.properties = response.documents;
      this.totalItems = response.total;
    });
  }

  resetResults() {
    this.properties = null;
  }
}
