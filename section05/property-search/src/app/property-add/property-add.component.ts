import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-property-add',
  templateUrl: './property-add.component.html',
  styleUrls: ['./property-add.component.css']
})
export class PropertyAddComponent implements OnInit {
  // template driven form
  // listing = {};

  // reactive form
  form: FormGroup;
  title = new FormControl('', Validators.required);
  price = ['', Validators.required];

  isCreated = false;

  filesToUpload = null;

  constructor(private formBuilder: FormBuilder, private propertyService: PropertyService) {
    this.form = formBuilder.group({
      title: this.title,
      price: this.price
    });
  }

  ngOnInit() {
  }

  handleFileInput(files: FileList) {
    return this.filesToUpload = files;
  }


  submitForm() {
    const files = this.filesToUpload;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append(`file${i}`, files.item(i), files.item(i).name);
    }
    formData.append('title', this.form.value.title);
    formData.append('price', this.form.value.price);

    this.propertyService.addProperty(formData).subscribe((response: any) => {
      if (response.success) {
        this.isCreated = true;
      }
    });
    // reactive form
    // this.propertyService.addProperty(this.form.value).subscribe((response: any) => {
    //   if (response.success) {
    //     this.isCreated = true;
    //   }
    // });
    // console.log(this.form.value);
    // template driven form
    // console.log(this.listing);
  }

}
