import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'th-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
  ) { }

  ngOnInit() {
  }

  logout() {
    console.log('logout');
    this.firebaseAuth
      .auth
      .signOut()
      .then(() => this.router.navigate(['./login']));
  }
}
