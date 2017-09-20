import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Recruiter } from '../../models/Recruiter';
import { RecruiterService} from "../../services/recruiter.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  recruiter: Recruiter;
  constructor(
    public authService: AuthService,
    public router: Router,
    public flashMessageService: FlashMessagesService,
    public recruiterService: RecruiterService
  ) { }

  ngOnInit() {
  }


  onSubmit() {
    console.log(this.email);
    this.recruiter = {
      name: this.name,
      email: this.email,
    }

    // Add user authentication for recruiter
    this.authService.register(this.email, this.password)
      .then((res) => {
        this.flashMessageService.show('Register user successful!', { cssClass: 'alert-success', timeout: 4000 });
        this.router.navigate(['/']);

        // Persist the recruiter, after user login
        this.recruiterService.persistRecruiter(this.recruiter);
      })
      .catch((err) => {
        this.flashMessageService.show(err.message, { cssClass: 'alert-danger', timeout: 4000 });
        this.router.navigate(['/register']);
      });
  }
}
