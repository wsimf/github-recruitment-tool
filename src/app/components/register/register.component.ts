import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMessageService: FlashMessagesService
  ) { }

  ngOnInit() {
  }


  onSubmit() {
    console.log(this.email);
    this.authService.register(this.email, this.password)
      .then((res) =>{
        this.flashMessageService.show('Register user successful!', { cssClass: 'alert-success', timeout: 4000 });
        this.router.navigate(['/']);
      })
      .catch((err) =>{
        this.flashMessageService.show(err.message, { cssClass: 'alert-danger', timeout: 4000 });
        this.router.navigate(['/register']);
      });
  }
}
