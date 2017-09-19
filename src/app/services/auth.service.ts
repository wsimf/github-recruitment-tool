import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/do';
import * as _ from 'lodash';

interface Repo {
  name: string;
  url: string;
}

@Injectable()
export class AuthService {
  repos$: Observable<Repo[]>;

  constructor(public afAuth:AngularFireAuth,private http: HttpClient ) { }

  login(email:string, password:string){
    return  new Promise((resolve, reject)=>{
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(userData => resolve(userData),err => reject(err));
    });
  }

  getAuth(){
    return this.afAuth.authState.map(auth => auth);
  }

  logout(){
    this.afAuth.auth.signOut();
  }

  authentication(){ // token: 9f7fa497acff70abc90ea8c4419bd35495615ba0
    console.log("called")
const headers = new HttpHeaders().set("Authorization", "token " + "9f7fa497acff70abc90ea8c4419bd35495615ba0");
    console.log({headers});
    return this.http.get<Repo[]>("https://api.github.com/user/repos", {headers});
    // this.repos$ = this.http.get<Repo[]>("https://api.github.com/user/repos", {headers}).map(data => _.values(data)).do(console.log);
    // this.http.get("https://api.github.com/user/repos", {headers}).subscribe(val => console.log(val)); n

  }
}
