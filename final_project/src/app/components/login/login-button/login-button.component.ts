import { Component, OnInit, Output } from '@angular/core';
import { User } from 'src/app/interfaces/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {

  user?:User;

  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }

  loginCheck(username:string, password:string) {
    this.userService.login(username, password).subscribe(x => {
      this.user = x
      console.log(this.user)
      if(this.user){
        return true;
      }else{
        return false;
      }
  });
    /* if(this.user == undefined){
      console.log('f');
      return false;
    }else{
      console.log('bien xd');
      return true;
    } */
  }

}