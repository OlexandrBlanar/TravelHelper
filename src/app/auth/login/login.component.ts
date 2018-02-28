import { Router } from '@angular/router';
import { fadeStateTrigger } from './../../shared/animations/fade.animation';
import { Message } from './../../shared/models/message';
import { Observable } from 'rxjs/Observable';
import { User } from './../../shared/models/user';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';

@Component({
  selector: 'th-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
//   animations: [fadeStateTrigger],
})

export class LoginComponent implements OnInit {

  public message: Message;
  public email: string;
  public password: string;
  public user: Observable<firebase.User>;
  public form: FormGroup;

  private formErrors = {
      'email': '',
      'password': '',
  };

  private validationMessages = {
      'email': {
          'required': 'Email не может быть пустым.',
          'email': 'Введен неправильный email',
        //   'forbiddenEmails': 'Email уже занят.',
      },
      'password': {
          'required': 'Пароль не может быть пустым.',
          'minlength': 'Значение должно быть не менее 5 символов.',
      },
  };

  constructor(
      private authService: AuthService,
      private router: Router
   ) {
      this.user = authService.user;
  }

  ngOnInit() {

    this.message = new Message('danger', '');
    // this.route.queryParams
    //   .subscribe((params: Params) => {
    //     if (params['nowCanLogin']) {
    //       this.showMessage({
    //         text: 'Теперь вы можете зайти в систему',
    //         type: 'success'
    //       });
    //     } else if (params['accessDenied']) {
    //       this.showMessage({
    //         text: 'Для работы с системой вам необходимо войти',
    //         type: 'warning'
    //       });
    //     }
    //   });
      this.buildForm();
  }

//   private showMessage(message: Message): void {
//     this.message = message;

//     window.setTimeout(() => {
//       this.message.text = '';
//     }, 5000);
//   }

  buildForm(): void {
      this.form = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      });

      this.form.valueChanges
          .subscribe(data => this.onValueChange(data));

      this.onValueChange();
  }

  onValueChange(data?: any): void {
      if (!this.form) return;
      
      for (let field in this.formErrors) {
          this.formErrors[field] = '';

          const control = this.form.get(field);
          if (control && control.touched && control.invalid) {
              let message = this.validationMessages[field];
              for (let key in control.errors) {
                  this.formErrors[field] += message[key] + ' ';
              }
          }
      }
  }

  login(): void {
      const email = this.form.get('email');
      const password = this.form.get('password');

      this.authService.login(email.value, password.value)
        .then(value => {
            this.router.navigate(['/map']);
            console.log(firebase.auth().currentUser.uid);
            console.log('Nice, it worked!');
        })
        .catch(err => {
            this.authService.showMessage.call(this, {
                text: `Something went wrong: ${err.message}`,
                type: 'warning',
            });
            console.log('Something went wrong:', err.message);
        });
  }

}
