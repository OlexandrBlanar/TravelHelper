import { Message } from './models/message';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()

export class AuthService {

  public user: Observable<firebase.User>;
  public message: Message;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
  }

  signup(email: string, password: string): Promise<any> {
    return  this.firebaseAuth
              .auth
              .createUserWithEmailAndPassword(email, password);
  }

  login(email: string, password: string): Promise<any> {
    return this.firebaseAuth
            .auth
            .signInWithEmailAndPassword(email, password);
  }

  reset(email: string): Promise<any> {
    return this.firebaseAuth
            .auth
            .sendPasswordResetEmail(email);
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

  showMessage(message: Message): void {
    this.message = message;
    window.setTimeout(() => {
      message.text = '';
    }, 5000);
  }

}
