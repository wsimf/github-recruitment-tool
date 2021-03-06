import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule} from '@angular/http';
import {FormControl, FormsModule} from '@angular/forms';

// AngularFire Imports
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import {HttpClientModule} from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { FlashMessagesModule } from 'angular2-flash-messages';

// Material imports
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatCardModule, MatFormFieldControl, MatProgressSpinnerModule, MatSliderModule} from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatDialogModule } from '@angular/material';

// Component Imports
import { AppComponent } from './app.component';
import { AddCandComponent } from './components/add-cand/add-cand.component';
import { AddReviewersComponent } from './components/add-reviewers/add-reviewers.component';
import { CandidatelistComponent } from './components/candidatelist/candidatelist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditCanComponent } from './components/edit-can/edit-can.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import  { ReviewCandidateComponent } from './components/review-candidate/review-candidate.component'

// Import services
import { AppService } from './services/app.service';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { CandidateService } from './services/candidate.service';
import {GithubService} from "./services/github.service";
import { ReviewerService } from './services/reviewer.service';
import { RecruiterService } from './services/recruiter.service';
import {EmailService} from "./services/email.service";
import { ResultsComponent } from './components/results/results.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { EmailManagerComponent } from './components/email-manager/email-manager.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const appRoutes: Routes =[
  {path:'',component:DashboardComponent,canActivate:[AuthGuard]},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'add-cand',component:AddCandComponent,canActivate:[AuthGuard]},
  {path:'results/:id', component:ResultsComponent,canActivate:[AuthGuard]},
  {path:'feedback', component:FeedbackComponent},
  {path: 'reviewCandidate/:id', component: ReviewCandidateComponent},
  {path:'feedback/:id', component:FeedbackComponent}, // https://elanderson.net/2017/01/angular-2-optional-route-parameter/
  {path:'**', component:PageNotFoundComponent},
  {path:'pagenotfound', component:PageNotFoundComponent},
];

export const firebaseConfig = {
  apiKey: "AIzaSyD7fRL10_swZMnvnG5CG-VClHsKtlkcAmU",
  authDomain: "nufeproject.firebaseapp.com",
  databaseURL: "https://nufeproject.firebaseio.com",
  storageBucket: "",
  messagingSenderId: "763732167157"
};

@NgModule({
  declarations: [
    AppComponent,
    AddCandComponent,
    CandidatelistComponent,
    DashboardComponent,
    EditCanComponent,
    LoginComponent,
    NavbarComponent,
    RegisterComponent,
    AddReviewersComponent,
    ResultsComponent,
    FeedbackComponent,
    EmailManagerComponent,
    ReviewCandidateComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    AngularFireModule.initializeApp(firebaseConfig),
    FlashMessagesModule,
    HttpClientModule,
    HttpModule,
    MatProgressSpinnerModule
  ],
  entryComponents: [
    AddReviewersComponent,
    EditCanComponent,
    EmailManagerComponent
  ],
  providers: [
    AppService,
    AngularFireAuth,
    AuthService,
    AuthGuard,
    AngularFireDatabase,
    CandidateService,
    GithubService,
    ReviewerService,
    RecruiterService,
    EmailService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
