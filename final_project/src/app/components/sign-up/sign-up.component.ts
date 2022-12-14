import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../interfaces/Department';

import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/User';

import {ChangeDetectorRef} from '@angular/core';
import { UserLogin } from 'src/app/interfaces/UserLogin';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  departments?: Department[];
  validUsername: string = '';
  validEmail: string = '';
  validPass:string = '';
  validDepartment: string = '';
  @Input() errorUsername?: string;
  errorEmail?: string;
  errorPass?: string;
  errorDepartment: boolean = false;
  userCreated: boolean = false;
  userTaken = false;

  constructor(
    private departmentService: DepartmentService,
    private cd: ChangeDetectorRef,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(){
    if(localStorage.getItem("id_token") != null){
      this.router.navigate(['/home']);
    }
    this.getDepartments();
  }

  getDepartments(): void{
    this.departmentService.getDepartments().subscribe(departments => {
      if(departments.status==404){
        console.error("Error 404: DEPARTMENTS NOT FOUND");
        return
      }
      this.departments = departments});
  }

  register(user: string, mail: string, password: string, department: string): void{
    if(user == undefined || user == ""){
      this.errorUsername = 'empty';
      this.validUsername = 'invalid';
    } else if(user.length < 4){
      this.errorUsername = 'short';
      this.validUsername = 'invalid';
    } else if(!/^[A-Za-z0-9]*$/.test(user)){
    this.errorUsername = 'invalid';
    this.validUsername = 'invalid';
    }
    else{
      this.errorUsername = undefined;
      this.validUsername = 'valid';
    }

    if(mail == undefined || mail == ""){
      this.errorEmail = 'empty';
      this.validEmail = 'invalid';
    } else{
      this.errorEmail = undefined;
      this.validEmail = 'valid';
    }

    if(password == undefined || password == ""){
      this.errorPass = 'empty';
      this.validPass = 'invalid';
    } else if(password.length < 8){
      this.errorPass = 'short';
      this.validPass = 'invalid';
    }
    else{
      this.errorPass = undefined;
      this.validPass = 'valid';
    }

    if(department == undefined || department == "0" || department == ""){
      this.errorDepartment = true;
      this.validDepartment = 'invalid';
    }
    else{
      this.errorDepartment = false;
      this.validDepartment = 'valid';
    }

    if(this.errorUsername != undefined || this.errorEmail != undefined || this.errorPass != undefined || this.errorDepartment == true){
      this.cd.detectChanges();
    }
    else{
      const userToCreate: UserLogin = { username: user, email: mail, password: password, departmentId: department, profileImg: '',
                        postsIds: [], chatsIds: [], contactsUsernames: [], messages: [], status: 'Pending'};
      this.userService.createUser(userToCreate).subscribe(x => {
        if(x.status==409){
          this.validEmail = 'invalid';
          this.validUsername = 'invalid';
          this.userTaken = true;
        }else{
          this.userCreated = true;
        }
        this.cd.detectChanges();
      });
    }
  }
}
