import { Component, OnInit } from '@angular/core';

import { Post } from 'src/app/interfaces/Post';
import { PostsService } from 'src/app/services/posts.service';
import { Zone } from 'src/app/interfaces/Zone';
import { ZonesService } from 'src/app/services/zones.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dogs-grid',
  templateUrl: './dogs-grid.component.html',
  styleUrls: ['./dogs-grid.component.css']
})
export class DogsGridComponent implements OnInit {

  posts?: Post[];
  zone: Zone | undefined;

  page: number = 1;
  count: number = 0;
  actualPost?: Post
  currentIndex: number = -1;


  constructor(
    private postsService: PostsService,
    private zoneService: ZonesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getZonePosts();
  }


  
  getZonePosts(): void {
    const id = this.route.snapshot.paramMap.get('zoneId');
    if(id)
      {
        this.zoneService.getZone(id).subscribe(zone =>{
          if(zone.status == 404){
            console.error(`Error 404: ZONE ${id} NOT FOUND`);
            return;
          }
          this.zone = zone;
          this.getZonePostsAux();
        } );
          
      }
    }
  
  getZonePostsAux():void{
    if(this.zone !== undefined)
      {
        this.postsService.getPostsByZone(this.zone.id, this.page - 1).subscribe(response => {
          if(response.status==404){
            console.error('Error 404: POSTS NOT FOUND');
            return;
          }
          const { posts, totalItems } = response;
          this.posts = posts;
          this.count = totalItems;
        });
      }
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.getZonePostsAux();
  }
  
}
