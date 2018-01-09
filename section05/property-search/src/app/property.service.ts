import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PropertyService {

  constructor(private http: HttpClient) { }

  listAllProperties(page) {
    if (page && page > 0) {
      return this.http.get(`http://localhost:3000/api/properties?page=${page}`);
    } else {
      return this.http.get('http://localhost:3000/api/properties');
    }
  }

  listOneProperty(propertyID) {
    return this.http.get(`http://localhost:3000/api/properties/${propertyID}`);
  }

  addProperty(property) {
    return this.http.post('http://localhost:3000/api/property', property);
  }

  search(term, page) {
    if (page && page > 0) {
      return this.http.get(`http://localhost:3000/api/search?page=${page}&term=${term}`);
    } else {
      return this.http.get(`http://localhost:3000/api/search?term=${term}`);
    }
  }

  geospatial(radius, latitude, longitude, page) {
    if (page && page > 0) {
      return this.http
        .get(`http://localhost:3000/api/geospatial?page=${page}&radius=${radius}&latitude=${latitude}&longitude=${longitude}`);
    } else {
      return this.http.get(`http://localhost:3000/api/geospatial?radius=${radius}&latitude=${latitude}&longitude=${longitude}`);
    }
  }

}
