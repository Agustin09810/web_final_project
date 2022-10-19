import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Image } from 'src/app/interfaces/Image';
import { User } from 'src/app/interfaces/User';
import { ImageByIdService } from 'src/app/services/image-by-id.service';
import { UserService } from 'src/app/services/user.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-user-preview',
  templateUrl: './user-preview.component.html',
  styleUrls: ['./user-preview.component.css']
})
export class UserPreviewComponent implements OnInit {


  constructor(private userService:UserService, private imageService:ImageByIdService) { }

  @Input() user!:User;
  @Input() originUser!:User;
  chatId!:string;
  lastMessage?:string;
  profileImgUrl?:Image;

  ngOnInit(): void {
    this.getChatId(this.originUser!, this.user!);
    this.getLastMessage();
    console.log(this.chatId + 'este chat es id')
    this.imageService.getImagesById(this.user.profileImg).subscribe(x => this.profileImgUrl = x);


  }


  getChatId(user1:User, user2:User) {
    user1.chatsIds.forEach(element => {
      if(user2.chatsIds.includes(element)){
        console.log('elemento XDD'+ element);
        this.chatId = element;
      }else{
        console.log('problemitas');
      }
    });

  }

  getLastMessage() {
    this.userService.getMessagesByChatId(this.chatId!).subscribe(x => {
      console.log(x + 'chat');
      this.lastMessage = x?.messages.at(-1)?.text.substring(0, 20) + '...';
      console.log(this.lastMessage + 'elultimo');

    })
  }

  @ViewChild('hiddenElement') chatToShowElement!: ChatComponent;

  showChat(){
    this.chatToShowElement.show();
  }
  

  //limitar el tamaño del username mostrado y ddel last msg mostrado.

}