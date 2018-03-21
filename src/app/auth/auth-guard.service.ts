import {Injectable} from '@angular/core';
import {Router, CanLoad} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {AuthService} from './auth.service';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuardService implements CanLoad {
  constructor(public authService: AuthService, public router: Router) {
  }

  canLoad(): Observable<boolean> | boolean {
    return this.authService.user.take(1).map((user) => {
      if (!user) {
        this.router.navigate(['login']);

        return false;
      } else {

        return true;
      }
    });
  }
}
