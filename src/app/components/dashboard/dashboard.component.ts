import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import * as _ from 'lodash';
import {Observable} from "rxjs/Observable";

interface Repo {
  name: string;
  url: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  repos$: Observable<Repo[]>;

  constructor(private authService: AuthService, private http: HttpClient) { }

  ngOnInit() {
  }

  test(){
    this.repos$ = this.authService.authentication();
  }


}
