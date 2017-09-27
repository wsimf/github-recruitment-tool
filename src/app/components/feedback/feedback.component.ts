import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {NgForm, NgControl} from "@angular/forms";
import {FeedbackForm} from "../../models/FeedbackForm";
import {ReviewerService} from "../../services/reviewer.service";
import {FlashMessagesService} from "angular2-flash-messages";
import {Router} from "@angular/router";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit {

  constructor(public reviewerService: ReviewerService,
              public router: Router,
              public flashMessageService: FlashMessagesService) { }

  ngOnInit() {
  }

  onSubmit(f: NgForm){
    let feedback = new FeedbackForm();
    Object.assign(feedback, f.value);

    feedback = JSON.parse(JSON.stringify(feedback, function (key, value) {
      return (key.endsWith("Score") && value === undefined) ? 3 : (value === undefined) ? '' : value
    }));
    console.log(feedback);
    this.reviewerService.newFeedback(feedback);

  // feedback submission succesful
  this.flashMessageService.show('Feedback submitted!', { cssClass: 'alert-success', timeout: 2000 });
  this.router.navigate(['/']);
  }

}
