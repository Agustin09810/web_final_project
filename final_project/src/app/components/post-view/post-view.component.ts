import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ImageByIdService } from 'src/app/services/image-by-id.service';
import { PostsService } from 'src/app/services/posts.service';

import { ActivatedRoute, Route, Router } from '@angular/router'; 
import { Post } from 'src/app/interfaces/Post';
import { Image } from 'src/app/interfaces/Image';
import { UserService } from 'src/app/services/user.service';
import { Chat } from 'src/app/interfaces/Chat';
import { ZonesService } from 'src/app/services/zones.service';
import { lastValueFrom } from 'rxjs';
import { User } from 'src/app/interfaces/User';

@Component({
  selector: 'app-post-view',
  templateUrl: './post-view.component.html',
  styleUrls: ['./post-view.component.css']
})
export class PostViewComponent implements OnInit {

  post?:Post;
  postImages:Image[] = [];
  currentUser?:User;

  @Input() 
  get inputPost():Post {return this.post!;}
  set inputPost(inputPost:Post){
    this.post = inputPost;
    this.getPostImages();
  }

  displayButton?:boolean = false;

 
  
  constructor(private postService:PostsService, 
    private imageService:ImageByIdService, 
    private route: ActivatedRoute, 
    private userService:UserService, 
    private zoneService:ZonesService,
    private router:Router) { }



  ngOnInit(): void {
    if (this.inputPost) {
      this.post = this.inputPost;
      this.displayButton = false;
      this.getCurrentUser();
    }else{
      this.getPostById('post-view-Id');
      this.displayButton = true;
      this.getCurrentUser();
    }
  }

  getRotueId(routeId: string): string | undefined{
    const id = this.route.snapshot.paramMap.get(routeId);
    if(id){
      return id;
    }else{
      return undefined;
    }
  }

  getPostById(routeId: string): void {
    const id = this.getRotueId(routeId);
    if(id)
      {
        this.postService.getPostsById(id).subscribe(post => {
          if(post.status==404){
            console.error('Error 404: POST NOT FOUND');
            return;
          }
          this.post = post;
          this.post?.photos.forEach(imgId => {
            this.imageService.getImagesById(imgId).subscribe(x =>  {
              if(x.status==404){
                console.error("Error 404: IMAGE NOT FOUND");
                return;
              }
              this.postImages?.push(x!);
            });
          })

        });
      }
  }

  cleanDate(date: Date): string {
    let dateInString: string = date.toString().split('T')[0];
    let dateToFormat = `${dateInString.substring(8,10)}/${dateInString.substring(5,7)}/${dateInString.substring(0,4)}`;
    return dateToFormat;
  }


  getPostImages() {
    this.postImages = [];
    this.post?.photos.forEach(imgId => {
      this.imageService.getImagesById(imgId).subscribe(x =>  {
        if(x.status==404){
          console.error("Error 404: IMAGE NOT FOUND");
          return;
        }
        this.postImages?.push(x!);
      });
    })
  }


  getCurrentUser(){
    return this.userService.getUser().subscribe(user => this.currentUser = user);
  }

  contactUser(): void {
    if(this.currentUser){
      let chat:Chat = {id:'random',  messagesIds:[]};
      this.userService.getUserByUsername(this.post?.user!).subscribe(user2 => {
        if(user2.status==404){
          console.error('Error 404, USER NOT FOUND');
          return;
        }
        if(user2.contactsUsernames.find((x: string | undefined) => x == this.currentUser?.username)){
          user2.chatsIds.forEach((chatUser2: string) => {
            this.currentUser!.chatsIds.forEach(chatUser1 => {
              if(chatUser2 == chatUser1){
                this.router.navigate(['/chats/' + user2.username + '/' + chatUser2]);
                return;
              }
            });
          });
          return;
        }
        this.userService.createChat(chat).subscribe(chatReceived => {
          user2.chatsIds.push(chatReceived.id);
          user2.contactsUsernames.push(this.currentUser!.username);

          this.currentUser!.chatsIds.push(chatReceived.id);
          this.currentUser!.contactsUsernames.push(user2.username);

          this.userService.updateUser(user2).subscribe( x => {
            if(x.status==404){
              console.error('Error 404, USER NOT FOUND');
              return;
            }
            this.userService.updateUser(this.currentUser!).subscribe( 
              y => {
                if(y.status==404){
                  console.error("Error 404: USER NOT FOUND");
                  return
                }
                this.router.navigate(['/chats/' + user2.username + '/' + chatReceived.id])
            })
          });
        })
      });
    }   
  };
    
  

  deletePost(): void {
    if(this.post){
      let username = this.post.user;
      let postId = this.post.id;
      let zoneId = this.post.lostZone;
      let photosIds = this.post.photos;

      this.postService.deletePost(this.post!).subscribe( postDeleted => {


        photosIds.forEach( async photoId => {
          await lastValueFrom(this.imageService.deleteImage(photoId));
        })
        
        this.userService.getUserByUsername(username).subscribe(user => {
          if(user.status==404){
            console.error('Error 404, USER NOT FOUND');
            return;
          }
        let currentUser = user;
        let index = currentUser.postsIds.indexOf(postId);
        currentUser.postsIds.splice(index, 1);

        this.userService.updateUser(currentUser).subscribe( x => {
          if(x.status==404){
            console.error("Error 404: USER NOT FOUND");
            return
          }
          this.zoneService.getZone(zoneId).subscribe(zone => {
            if(zone.status == 404){
              console.error(`Error 404: ZONE ${zoneId} NOT FOUND`);
              return;
            }
            let currentZone = zone;
            let index = currentZone.postsIds.indexOf(postId);
            currentZone.postsIds.splice(index, 1);
            this.zoneService.updateZone(currentZone).subscribe( () =>  window.location.reload());
          });
        });
      });
    });
    }
  }

}
