import { Message } from './../../shared/models/message';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { User } from './../../shared/models/user';
import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';

@Component({
  selector: 'th-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  public message: Message;
  public email: string;
  public password: string;
  public user: Observable<firebase.User>;
  public regForm: FormGroup;

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
          .subscribe(data => this.onValueChange());
      this.onValueChange();
  }

  onValueChange(data?: any): void {
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
      const name = this.regForm.get('name');

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

  // formReg: FormGroup;

  // constructor(
  //   private authService: AuthService,
  // ) { }

  // ngOnInit() {
  //   this.formReg = new FormGroup({
  //     'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
  //     'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
  //     'name': new FormControl(null, [Validators.required]),
  //     'agree': new FormControl(false, [Validators.requiredTrue])
  //   });
  // }

  // onSubmit() {
  //   const {email, password, name} = this.formReg.value;
  //   const user = new User(email, import { ReactiveFormsModule }   from '@angular/forms';password, name);

  //   this.usersService.createNewUser(user)
  //     .subscribe(() => {
  //       this.router.navigate(['/login'], {
  //         queryParams: {
  //           nowCanLogin: true
  //         }
  //       });
  //     });
  // }

//   forbiddenEmails(control: FormControl): Promise<any> {
//     return new Promise((resolve, reject) => {
//       this.usersService.getUserByEmail(control.value)
//         .subscribe((user: User) => {
//           if (user) {
//             resolve({forbiddenEmail: true});
//           } else {
//             resolve(null);
//           }
//         });
//     });
//   }

}
