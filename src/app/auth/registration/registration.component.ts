import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from './../auth.service';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase/app';
import { Message } from '../models/message';
import {fadeStateTrigger} from '@shared/animations/fade.animation';


@Component({
  selector: 'th-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [fadeStateTrigger],
})
export class RegistrationComponent implements OnInit {

  message: Message;
  email: string;
  password: string;
  user: Observable<firebase.User>;
  regForm: FormGroup;

  private formErrors = {
      'email': '',
      'password': '',
      'repeatPassword': '',
      'agree': '',
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
      'repeatPassword': {
          'required': 'Пароль не может быть пустым.',
          'minlength': 'Значение должно быть не менее 5 символов.',
      },
      'agree': {
            'required': 'Обязательное поле.',
      }
  };

  constructor(
      private authService: AuthService, private router: Router
   ) {
      this.user = authService.user;
  }

  ngOnInit() {
      this.message = new Message('danger', '');
      this.buildForm();
  }

  buildForm(): void {
      this.regForm = new FormGroup({
            'email': new FormControl(null, [Validators.required, Validators.email]),
            'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'repeatPassword': new FormControl(null, [Validators.required, Validators.minLength(6)]),
            'agree': new FormControl(false, [Validators.requiredTrue])
      });

      this.regForm.valueChanges
          .subscribe(() => this.onValueChange());
      this.onValueChange();
  }

  onValueChange(): void {
      if (!this.regForm) {
          return;
      }

      for (const field of Object.keys(this.formErrors)) {
          this.formErrors[field] = '';

          const control = this.regForm.get(field);
          if (control && control.touched && control.invalid) {
              const message = this.validationMessages[field];
              for (const key of Object.keys(control.errors)) {
                  this.formErrors[field] += message[key] + ' ';
              }
          }
      }
  }

  signup(): void {
      const email = this.regForm.get('email');
      const password = this.regForm.get('password');
      const repeatPassword = this.regForm.get('repeat-password');

      if (password !== repeatPassword) {
        this.formErrors.repeatPassword = 'Паролі не співпадають';
        this.authService.showMessage.call(this, {
            text: 'Введіть однаковий пароль',
            type: 'danger',
        });

        return;
      }

      this.authService.signup(email.value, password.value)
        .then(value => {
            this.router.navigate(['/login']);
            console.log('Success!', value);
        })
        .catch(err => {
            this.authService.showMessage.call(this, {
                text: `Something went wrong: ${err.message}`,
                type: 'danger',
            });
            console.log('Something went wrong:', err.message);
        });
  }
}
