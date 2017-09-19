import { Component, OnInit } from '@angular/core';
import {AppService} from '../../services/app.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages'; 


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email:string;
  password:string;

  constructor(
    private appService:AppService,
    public authService: AuthService,
    public router: Router,
    public flashMessageService: FlashMessagesService
  ) { }

  ngOnInit() {
    console.log(this.appService.myData());
  }

  onSubmit(){
    this.authService.login(this.email, this.password)
    .then((res) =>{
      this.flashMessageService.show('Your are logged in', { cssClass: 'alert-success', timeout: 4000 });
      this.router.navigate(['/'])
    })
    .catch((err) =>{
      this.flashMessageService.show(err.message, { cssClass: 'alert-danger', timeout: 4000 });
      this.router.navigate(['/login'])
    })
  }
}
