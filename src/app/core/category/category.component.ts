import { Component, OnInit } from '@angular/core';
import { CategoryService } from './category.service';
import * as firebase from 'firebase/app';
import { AuthService } from '../../auth/auth.service';
import { DbService } from '../../shared/services/db.service';

@Component({
  selector: 'th-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  public newCategory: string;
  private userUid: string;
  private categories: string[];

  constructor(private dbService: DbService) {
    this.categories = [];
  }

  ngOnInit() {
    firebase.auth().onAuthStateChanged(user => {
      this.userUid = user.uid;
      console.log(user.uid);
      this.dbService.getCategories(user.uid)
      .subscribe(data => {
        this.categories = data.categories;
        console.log(this.categories);
      });
    });

    // this.dbService.getCategories()
    //   .subscribe(data => this.categories);

    // this.afs.collection('users').doc('QapfApMP1qO3Eql80nFVmhvR4Aj1')
    //         .snapshotChanges();
  }

  onAddCategory() {
    this.dbService.addCategory(this.userUid, this.newCategory, this.categories);
  }
}
