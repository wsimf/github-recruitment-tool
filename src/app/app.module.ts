import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/Forms';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import  { MaterialModule } from '@angular/material';
import { MdCardModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdDialogModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AddCandComponent } from './components/add-cand/add-cand.component';
import { AddReviewersComponent } from './components/add-reviewers/add-reviewers.component';
import { CandidatelistComponent } from './components/candidatelist/candidatelist.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EditCanComponent } from './components/edit-can/edit-can.component';
import { LoginComponent } from './components/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import {AppService} from './services/app.service';

const appRoutes: Routes =[
  {path:'',component:DashboardComponent},
  {path:'login',component:LoginComponent},
  {path:'register',component:RegisterComponent},
  {path:'add-cand',component:AddCandComponent},
];

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
    AddReviewersComponent
  ],
  imports: [
    BrowserModule,
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    MaterialModule,
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdDialogModule
  ],
  entryComponents:[
    AddReviewersComponent,
    EditCanComponent
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
