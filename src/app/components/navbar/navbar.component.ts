import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import 'rxjs/add/operator/map';

/**
 * @navbar.component.ts
 * The navigation bar buttons based on the logged in state
 */
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isLoggedIn:boolean;
  loggedUser:string;

  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMesssagesService:FlashMessagesService
  ) { }

  ngOnInit() {
    this.authService.getAuth().subscribe(auth =>{
      if(auth){
        this.isLoggedIn = true;
        this.loggedUser = auth.email;
      }else{
        this.isLoggedIn = false;
      }
    })
  }

  /**
   * Log user out of the system
   */
  onLogoutClick(){
    this.authService.logout();
    this.flashMesssagesService.show('You are logged out', { cssClass:'alert-success' , timeout: 4000 });
    this.router.navigate(['/login']);
  }
}
