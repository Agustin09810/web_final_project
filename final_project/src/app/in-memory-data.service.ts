import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Image } from './interfaces/Image';
import { Zone } from './interfaces/Zone';



@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService {

  constructor() { }

  createDb() {
    const images: Image[] = [
      { imageId: '1', imageUrl: '../assets/images/img3.jpg' },
      { imageId: '2', imageUrl: '../assets/images/img3.jpg' },
      { imageId: '3', imageUrl: '../assets/images/img3.jpg' },
      { imageId: '4', imageUrl: '../assets/images/img3.jpg' },
      { imageId: '5', imageUrl: '../assets/images/img3.jpg' },
      { imageId: '6', imageUrl: '../assets/images/img3.jpg' }
    ];
    const zones: Zone[] = [
      {imgId:'1', name:'name1', zoneId:'1'},
      {imgId:'2', name:'name2', zoneId:'2'},
      {imgId:'3', name:'name3', zoneId:'3'},
      {imgId:'4', name:'name4', zoneId:'4'},
      {imgId:'5', name:'name5', zoneId:'5'},
      {imgId:'6', name:'name6', zoneId:'6'}
    ]
    return {images, zones};
  }
}