import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

import { ImageUploadComponent } from './image-upload/image-upload.component'
import { DogNameComponent } from './dog-name/dog-name.component'
import { DogGenderComponent } from './dog-gender/dog-gender.component'

import {Breed} from '../../interfaces/Breed';

import {Zone} from '../../interfaces/Zone';
import {ZonesService} from '../../services/zones.service';

import {Post} from '../../interfaces/Post';
import {PostsService} from '../../services/posts.service';


@Component({
  selector: 'app-add-edit-post',
  templateUrl: './add-edit-post.component.html',
  styleUrls: ['./add-edit-post.component.css']
})
export class AddEditPostComponent implements OnInit {

  step: string = "name";
  textNavbar: string = "Nombre";

  @ViewChild('dogPhotosComponent') dogPhotosComponent!: ImageUploadComponent;
  @ViewChild('dogNameComponent') dogNameComponent!: DogNameComponent;
  @ViewChild('dogGenderComponent') dogGenderComponent!: DogGenderComponent;

  dogName?: string;
  otherNames: string[] = [];
  dogGender?: string;
  dogBreed?: string;
  breeds: Breed[] = [];
  lastSeenDate?: string;
  lastSeenHour?: string;
  lostZone?: string;
  ubiDetails: string = "";
  dogDescription: string = "";
  photos:string[] = [];

  post?: Post;

  zone?: Zone;

  editBool: boolean = false;

  constructor(
    private router: Router,
    private postService: PostsService,
    private zoneService: ZonesService,
    private route: ActivatedRoute
  ) { }
  
  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('postId')
    if(postId != undefined){
      this.postService.getPostsById(postId).subscribe(post => {
        this.post = post;
        this.dogName = this.post.dogName;
        if(this.post.dogNickNames != undefined){
          this.otherNames = this.post.dogNickNames;
        }
        this.dogGender = this.post.dogGender;
        this.dogBreed = this.post.dogBreed;
        this.lastSeenDate = this.post.lostOn.toString().split('T')[0];
        this.lastSeenHour = this.post.lostOn.toString().split('T')[1].substring(0,5);
        this.lostZone = this.post.lostZone;
        console.log(this.post.lostZone);
        if(this.post.lostDescription != undefined){
          this.ubiDetails = this.post.lostDescription;
        }
        this.ubiDetails = this.post.lostDescription;
        if(this.post.dogDescription != undefined){
          this.dogDescription = this.post.dogDescription;
        }
        this.dogDescription = this.post.dogDescription;
        this.photos = this.post.photos;
        this.editBool = true;
      }); 
    }
  }

  navigateAux(data: string[]){
    this.step=data[0];
    switch(this.step){
      case "name":
        this.textNavbar = "Nombre";
        break;
      case "gender":
        this.textNavbar = "Género";
        if(data[1]){
        this.dogName = data[1];
        }
        if(data[2]){
          let aux: string[] = [data[2]];
          if(data[3]){
            aux.push(data[3]);
          }
          this.otherNames = aux;
        }
        break;
      case "breed":
        this.textNavbar = "Raza";
        if(data[1]){
        this.dogGender = data[1];
        }
        break;
      case "date":
        this.textNavbar = "Fecha";
        this.dogBreed = data[1];
        break;
      case "photos":
        this.textNavbar = "Fotos";
        if(data[1]){
          this.lastSeenDate = data[1];
          this.lastSeenHour = data[2];
          this.lostZone = data[3];
          if(data[4]){
            this.ubiDetails = data[4];
          }
        }
        break;
      default:
        this.publish(data);
        break;
    }
  }
      
  randomID(length: number): string {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    }

    publish(photosA: string[]){
      this.photos = photosA;
      let post = this.createPost();

      this.postService.addPost(post).subscribe(postX=>console.log(postX));
      this.zoneService.getZone(this.lostZone!).subscribe(zone => {
        zone.postsIds.push(post.id);
        this.zone = zone;
        this.zoneService.addPostToZone(this.zone!.id, this.zone!).subscribe( () => {
          this.router.navigate(['/zone/' + zone.id])});
      });
    }

    createPost(): Post{
      let post: Post = { id: this.randomID(15), user:'admin', dogName: this.dogName!, dogNickNames: this.otherNames, dogGender: this.dogGender!,
                        dogBreed: this.dogBreed!, lostOn: new Date(this.lastSeenDate + ' ' + this.lastSeenHour), lostZone: this.lostZone!, lostDescription: this.ubiDetails, 
                        dogDescription: this.dogDescription, photos: this.photos};
      return post;
    }
      
      
}
