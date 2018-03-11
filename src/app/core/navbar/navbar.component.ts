import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'th-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(private firebaseAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  logout() {
    console.log('logout');
    this.firebaseAuth
      .auth
      .signOut();
  }
}
