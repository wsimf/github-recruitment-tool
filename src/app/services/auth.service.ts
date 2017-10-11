import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import 'rxjs/add/operator/do';
import * as _ from 'lodash';
import {User} from "firebase/app";

@Injectable()
export class AuthService {

  constructor(public afAuth: AngularFireAuth) {
  }

  login(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => resolve(userData), err => reject(err));
    });
  }

  /**
   * Check if the user is already loggedin
   * @returns {Observable<any>}
   */
  getAuth() {
    return this.afAuth.authState.map(auth => auth);
  }

  /**
   * Log user out
   */
  logout() {
    this.afAuth.auth.signOut();
  }

  /**
   * Register a new authentication using user email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<any>}
   */
  register(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(userData => resolve(userData), err => reject(err));
    });
  }

}
