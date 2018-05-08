import {Component, HostBinding, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../auth.service';
import { Message } from '../models/message';
import { fadeStateTrigger } from './../../shared/animations/fade.animation';

@Component({
  selector: 'th-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
  animations: [fadeStateTrigger],
})
export class NewPasswordComponent implements OnInit {

  email: string;
  message: Message;
  form: FormGroup;
  errors: string;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.message = new Message('danger', '');
    this.buildForm();
  }

  buildForm(): void {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  resetPassword(): void {
    const email = this.form.get('email');
    this.authService.reset(email.value)
      .then(() => {
        console.log('Success');
      })
      .catch((error) => {
        this.authService.showMessage.call(this, {
            text: error,
            type: 'danger',
          });
      });
  }
}
