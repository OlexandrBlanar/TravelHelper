import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}
  canActivate(): Observable<boolean> | boolean {
	// console.log(this.authService.user);
	return this.authService.user.map((user) => {
		if (!user) {
			this.router.navigate(['login']);
			return false;
		} else {
			return true;
		}
	});
  }
}
