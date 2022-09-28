import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Image } from '../interfaces/Image';
import { map, filter, ignoreElements } from 'rxjs/operators';
import { Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageByIdService {

  private imagesUrl = 'api/images'

  constructor(private http: HttpClient) { }

  getImages() {
    return this.http.get<Image[]>(this.imagesUrl)
  }

  getImagesById(id:string) {
    console.log(id);
    return this.getImages().pipe(map(imgs => imgs.find(img => img.imageId === id)));
  }

}